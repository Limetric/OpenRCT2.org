import multer from 'multer';
import {Octokit} from '@octokit/rest';
import {got} from 'got';
import {Config} from '../../misc/config.js';
import {Releases} from '../../misc/releases.js';
import {Log} from '../../utils/log.js';
import {ReleasesParser} from '../../modules/releasesParser/releasesParser.js';

/**
 * @typedef {import('express').default} express
 * @typedef {import('../../misc/release.js').Release} Release
 */

const octokit = new Octokit({
  auth: Config.get('altApi')['gitHub']['personalAccessToken'],
});

const multerInstance = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

export class AltApiRouter {
  #router;

  get router() {
    return this.#router;
  }

  /**
   * Verify key validity
   *
   * @param {string} key Key
   * @returns {boolean} Is valid
   */
  static #verifyKey(key) {
    if (!key) {
      return false;
    }

    const {accessKeys} = Config.get('altApi');
    if (typeof (accessKeys) !== 'object') {
      return false;
    }

    return typeof (accessKeys[key]) !== 'undefined';
  }

  /**
   * Push build handler
   *
   * @param {express.Request} req Request
   * @param {express.Response} res Response
   * @returns {void}
   */
  static async #pushBuild(req, res) {
    // Check input validity
    if (!req.body['key'] || !req.body['version'] || !req.body['gitHash'] || !req.body['gitBranch'] || !req.body['fileName']) {
      res.json({
        error: 1,
        errorMessage: 'Invalid data input',
      });
      return;
    }

    // Check for file input
    if (!req.file && !req.body['url']) {
      res.json({
        error: 1,
        errorMessage: 'Invalid file/url input',
      });
      return;
    }

    // Verify access key
    if (!this.#verifyKey(req.body['key'])) {
      res.json({
        error: 1,
        errorMessage: 'Invalid access key',
      });
      return;
    }

    const versionName = `v${req.body['version']}-${req.body['gitHash'].toLowerCase().substr(0, 7)}`;

    const ghConfig = Config.get('altApi')['gitHub'];

    // Get releases by version name
    let ghRelease;
    try {
      ghRelease = (await octokit.repos.getReleaseByTag({
        owner: ghConfig['owner'],
        repo: ghConfig['repo'],
        tag: versionName,
      }))?.['data'];
    } catch (error) {
      // An error is also thrown when it doesn't exist
      Log.debug(error);
    }

    // Create release if it doesn't exist
    if (!ghRelease) {
      try {
        ghRelease = (await octokit.repos.createRelease({
          owner: ghConfig['owner'],
          repo: ghConfig['repo'],
          tag_name: versionName,
          draft: false,
          prerelease: false,
          body: `\`${req.body['gitHash']}\`;\`${req.body['gitBranch']}\``,
        }))?.['data'];
      } catch (error) {
        Log.error(error);
        res.json({
          error: 1,
          errorMessage: 'Failed to create GitHub release',
        });
        return;
      }
      Log.debug(`Created new '${versionName}' GitHub release`);
    } else {
      Log.debug(`Using existing '${versionName}' GitHub release`);
    }

    const releaseId = ghRelease ? ghRelease['id'] : undefined;

    try {
      /** @type {Buffer} */
      const fileBuffer = req.file?.buffer ?? await got(req.body['url']).buffer();

      // Upload asset to GitHub
      const assetData = (await octokit.repos.uploadReleaseAsset({
        owner: ghConfig['owner'],
        repo: ghConfig['repo'],
        release_id: releaseId,
        name: req.body['fileName'],
        data: fileBuffer,
        headers: {
          'content-length': req.file ? req.file.size : Buffer.byteLength(fileBuffer, 'binary'),
          'content-type': req.file ? req.file.mimetype : 'application/octet-stream',
        },
      }))?.['data'];

      // Push asset data to generic release data for lat
      if (assetData) {
        if (typeof (ghRelease['assets']) !== 'object') {
          ghRelease['assets'] = [];
        }

        ghRelease['assets'].push(assetData);
      }
    } catch (error) {
      Log.error(error);
      res.json({
        error: 1,
        errorMessage: 'Failed to upload GitHub release asset. May already exist.',
      });
      return;
    }

    Log.info(`Processed AltApi asset upload for '${versionName}'`);

    // Work-around for GitHub API issue regarding wrong created_date on read
    process.nextTick(async () => {
      try {
        await ReleasesParser.parseReleaseData(ghRelease, '*');
      } catch (error) {
        Log.warn(error);
      }
    });

    res.json({
      message: 'Processed!',
    });
  }

  /**
   * Get latest download handler
   *
   * @param {express.Request} req Request
   * @param {express.Response} res Response
   * @returns {void}
   */
  static async #getLatestDownload(req, res) {
    let branch = req.body['gitBranch'] || req.query['gitBranch'];
    if (branch === 'master') {
      branch = 'releases';
    }
    if (!branch || !['develop', 'releases'].includes(branch)) {
      res.json({
        error: 1,
        errorMessage: 'Invalid branch specified.',
      });
      return;
    }

    const flavourId = parseInt(req.body['flavourId'] || req.query['flavourId'], 10);
    if (Number.isNaN(flavourId)) {
      res.json({
        error: 1,
        errorMessage: 'Invalid flavour id specified.',
      });
      return;
    }

    /** @type {Release} */
    let release;
    try {
      release = (await Releases.getLastByBranch(branch, 1))?.[0];
    } catch (error) {
      Log.warn(error);
    }
    if (!release) {
      res.json({
        error: 1,
        errorMessage: 'No branch release available.',
      });
      return;
    }

    const asset = release.getAssetByFlavourId(flavourId);
    if (!asset) {
      res.json({
        error: 1,
        errorMessage: 'No download available.',
      });
      return;
    }

    // User agent "Mozilla/5.0" is used by launcher, which doesn't support redirect URLs
    const supportsRedirects = req.get('User-Agent') !== 'Mozilla/5.0' || typeof (req.body['redirects']) !== 'undefined' || typeof (req.query['redirects']) !== 'undefined';
    let {url} = asset;
    if (!supportsRedirects) {
      try {
        url = await asset.getRedirlessUrl();
      } catch (error) {
        Log.warn(error);
      }
    }

    let {commit, commitShort} = release;
    const {fileHash} = asset;
    // Fake commit hashes based on file hash
    if (!commit) {
      commit = fileHash.substring(0, 40);
      commitShort = commit.substring(0, 7);
    }

    res.json({
      buildId: release.id,
      downloadId: `${release.version}-${release.branch}-${release.commitShort ? release.commitShort : fileHash.substring(0, 7)}`,
      fileSize: asset.fileSize,
      url,
      fileHash,
      gitHash: commit,
      gitHashShort: commitShort,
      addedTime: release.published,
      addedTimeUnix: release.published.getTime() / 1000,
    });
  }

  constructor(httpServer) {
    const router = httpServer.newRouter();
    this.#router = router;

    router.all('/', multerInstance.single('file'), async (req, res) => {
      const command = req.body['command'] ?? req.query['command'];

      if (command === 'push-build') {
        this.constructor.#pushBuild(req, res);
      } else if (command === 'get-latest-download') {
        this.constructor.#getLatestDownload(req, res);
      } else {
        res.json({
          error: 1,
          errorMessage: 'Unknown command.',
        });
      }
    });
  }
}
