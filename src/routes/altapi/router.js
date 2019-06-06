import Releases from '../../misc/releases';
import Multer from 'multer';
import Config from '../../config';
import Octokit from '@octokit/rest';
import log from '../../utils/log';
import rpn from 'request-promise-native';

const octokit = new Octokit({
    auth: Config.altApi['gitHub']['personalAccessToken']
});

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});

export default class AltApiRouter {
    #router;

    get router() {
        return this.#router;
    }

    /**
     * Verify key validity
     * @param {string} key
     * @returns {boolean} validity
     */
    static #verifyKey(key) {
        if (!key)
            return false;

        const keys = Config.altApi['accessKeys'];
        if (typeof (keys) !== 'object')
            return false;

        return typeof (keys[key]) !== 'undefined';
    }

    /**
     *
     * @param req
     * @param res
     * @returns {void}
     */
    static async #pushBuild(req, res) {
        //Check input validity
        if (!req.body['key'] || !req.body['version'] || !req.body['gitHash'] || !req.body['gitBranch'] || !req.body['fileName']) {
            res.json({
                error: 1,
                errorMessage: 'Invalid data input'
            });
            return;
        }

        //Check for file input
        if (!req.file && !req.body['url']) {
            res.json({
                error: 1,
                errorMessage: 'Invalid file/url input'
            });
            return;
        }

        //Verify access key
        if (!this.#verifyKey(req.body['key'])) {
            res.json({
                error: 1,
                errorMessage: 'Invalid access key'
            });
            return;
        }

        const versionName = `v${req.body['version']}-${req.body['gitHash'].substr(0, 7)}`;

        const ghConfig = Config.altApi['gitHub'];

        //Get releases by version name
        let ghRelease;
        try {
            ghRelease = await octokit.repos.getReleaseByTag({
                owner: ghConfig['owner'],
                repo: ghConfig['repo'],
                tag: versionName,
            });
        } catch (error) {
            //An error is also thrown when it doesn't exist
            log.debug(error);
        }

        //Create release if it doesn't exist
        if (!ghRelease || !ghRelease.data) {
            try {
                ghRelease = await octokit.repos.createRelease({
                    owner: ghConfig['owner'],
                    repo: ghConfig['repo'],
                    tag_name: versionName,
                    draft: false,
                    prerelease: false,
                    body: `\`${req.body['gitHash']}\`;\`${req.body['gitBranch']}\``
                });
            } catch (error) {
                log.error(error);
                res.json({
                    error: 1,
                    errorMessage: 'Failed to create GitHub release'
                });
                return;
            }
            log.debug(`Created new '${versionName}' GitHub release`);
        } else
            log.debug(`Using existing '${versionName}' GitHub release`);

        const uploadUrl = ghRelease && ghRelease.data ? ghRelease.data['upload_url'] : undefined;

        try {
            const fileBuffer = req.file ? req.file.buffer : await rpn({
                url: req.body['url'],
                encoding: null
            });

            //Upload asset to GitHub
            await octokit.repos.uploadReleaseAsset({
                url: uploadUrl,
                name: req.body['fileName'],
                file: fileBuffer,
                headers: {
                    'content-length': req.file ? req.file.size : Buffer.byteLength(fileBuffer),
                    'content-type': req.file ? req.file.mimetype : 'application/octet-stream'
                }
            });
        } catch (error) {
            log.error(error);
            res.json({
                error: 1,
                errorMessage: 'Failed to upload GitHub release asset. May already exist.'
            });
            return;
        }

        log.info(`Processed AltApi asset upload for '${versionName}'`);

        res.json({
            message: 'Processed!'
        });
    }

    /**
     *
     * @param req
     * @param res
     * @returns {void}
     */
    static async #getLatestDownload(req, res) {
        let branch = req.body['gitBranch'] || req.query['gitBranch'];
        if (branch === 'master')
            branch = 'releases';
        if (!branch || !['develop', 'releases'].includes(branch)) {
            res.json({
                error: 1,
                errorMessage: 'Invalid branch specified.'
            });
            return;
        }

        const flavourId = parseInt(req.body['flavourId'] || req.query['flavourId'], 10);
        if (isNaN(flavourId)) {
            res.json({
                error: 1,
                errorMessage: 'Invalid flavour id specified.'
            });
            return;
        }

        let release;
        try {
            const releases = await Releases.getLastByBranch(branch, 1);
            release = releases.length ? releases[0] : undefined;
        } catch (error) {
            log.warn(error);
        }
        if (!release) {
            res.json({
                error: 1,
                errorMessage: 'No branch release available.'
            });
            return;
        }

        const asset = release.getAssetByFlavourId(flavourId);
        if (!asset) {
            res.json({
                error: 1,
                errorMessage: 'No download available.'
            });
            return;
        }

        //User agent "Mozilla/5.0" is used by launcher, which doesn't support redirect URLs
        const supportsRedirects = req.get('User-Agent') !== 'Mozilla/5.0' || typeof (req.body['redirects']) !== 'undefined' || typeof (req.query['redirects']) !== 'undefined';
        let url = asset.url;
        if (!supportsRedirects) {
            try {
                url = await asset.redirlessUrl;
            } catch (error) {
                log.warn(error);
            }
        }

        let commit = release.commit;
        let commitShort = release.commitShort;
        const fileHash = asset.fileHash;
        //Fake commit hashes based on file hash
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
            addedTimeUnix: release.published.getTime() / 1000
        });
    }

    constructor(httpServer) {
        const router = this.#router = httpServer.newRouter();
        router.all('/', multer.single('file'), async (req, res) => {
            const command = req.body['command'] || req.query['command'];

            if (command === 'push-build') {
                this.constructor.#pushBuild(req, res);
            } else if (command === 'get-latest-download') {
                this.constructor.#getLatestDownload(req, res);
            } else {
                res.json({
                    error: 1,
                    errorMessage: 'Unknown command.'
                });
            }
        });
    }
}
