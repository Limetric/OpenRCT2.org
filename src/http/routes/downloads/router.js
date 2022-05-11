import HTTPServer from '../../http.js';
import Releases from '../../../misc/releases.js';
import StringUtils from '../../../utils/string.js';
import log from '../../../utils/log.js';

export default class DownloadsRouter {
  #router;

  get router() {
    return this.#router;
  }

  constructor(httpServer) {
    const router = httpServer.newRouter();
    this.#router = router;

    router.get('/', async (req, res) => {
      let lastRelease;
      let lastDevelop;
      try {
        let releases = await Releases.getLastByBranch('releases', 1);
        lastRelease = releases.length ? releases[0] : undefined;
        releases = await Releases.getLastByBranch('develop', 1);
        lastDevelop = releases.length ? releases[0] : undefined;
      } catch (error) {
        log.warn(error);
        lastRelease = {};
        lastDevelop = {};
      }

      const template = require('./downloadsIndex.marko');
      res.marko(template, {
        page: {
          title: 'Downloads',
          description: 'Downloads for the open-source adaption of RollerCoaster Tycoon 2. Free to download.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
        lastRelease,
        lastDevelop,
      });
    });

    router.get('/demo', (req, res) => {
      const template = require('./downloadDemo.marko');
      res.marko(template, {
        page: {
          title: 'Download RCT2 Demo',
          description: 'By downloading the free RollerCoaster Tycoon 2 TTP Demo you can play the full OpenRCT2 game.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });

    router.get('/demo/zip', (req, res) => {
      res.redirect('https://openrct2.org/files/demo/RollerCoasterTycoon2TTP_EN.zip');
    });

    router.get('/demo/exe', (req, res) => {
      res.redirect('https://openrct2.org/files/demo/RollerCoasterTycoon2TTP_EN.exe');
    });

    router.param('branch', (req, res, next, branch) => {
      if (branch.length > 50) {
        throw new Error('Invalid branch.');
      }

      next();
    });

    // Rewrite wrong latest download link used by some websites
    router.get('/latest/:branch', (req, res) => {
      res.redirect(`../${req.params.branch}/latest`);
    });

    // Rewrite legacy `master` branch links to `releases`
    // Note: `branch` is actually an `identifier`
    router.get('/master/:branch', (req, res) => {
      res.redirect(`../releases/${req.params.branch}`);
    });

    router.get('/:branch', async (req, res) => {
      /**
       * @type {string}
       */
      const {branch} = req.params;

      let releases;
      try {
        releases = await Releases.getLastByBranch(branch, 30);
      } catch (error) {
        log.warn(error);
        releases = [];
      }

      if (!releases.length) {
        const clientError = new Error('Requested branch has no downloads.');
        clientError.status = '404';
        throw clientError;
      }

      const uflBranch = StringUtils.uppercaseFirstLetter(branch);

      const template = require('./downloadsBranchIndex.marko');
      res.marko(template, {
        page: {
          title: `${uflBranch} downloads`,
          description: `Latest ${releases.length} OpenRCT2 downloads in the ${uflBranch} branch.`,
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
        branch: uflBranch,
        releases,
      });
    });

    router.param('identifier', async (req, res, next, identifier) => {
      let release;

      try {
        if (identifier === 'latest') {
          const releases = await Releases.getLastByBranch(req.params.branch, 1);
          release = releases.length ? releases[0] : undefined;
          req.latest = true;
        } else {
          release = await Releases.getByBranchVersion(req.params.branch, identifier);
        }
      } catch (error) {
        log.error(error);
      }

      if (!release) {
        const clientError = new Error('Requested download is not available.');
        clientError.status = '404';
        throw clientError;
      }

      req.release = release;

      // Always redirect to gitHashShort link
      /* if (identifier !== 'latest' && identifier !== download.gitHashShort) {
              res.redirect(`../${download.gitBranch}/${download.gitHashShort}`);
              return;
          } */

      next();
    });

    router.get('/:branch/:identifier', async (req, res) => {
      /**
       * @type {Release}
       */
      const {release} = req;

      const template = require('./downloadsView.marko');
      res.marko(template, {
        page: {
          title: req.latest ? `Latest ${req.release.shortTitle} download` : `Download ${req.release.shortTitle}`,
          description: req.latest ? `Download latest OpenRCT2 ${req.release.longTitle} of the OpenRCT2 project. The open-source adaption of RollerCoaster Tycoon 2.` : `Download OpenRCT2 ${req.release.longTitle} of the OpenRCT2 project. The open-source adaption of RollerCoaster Tycoon 2.`,
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
        release,
        // download: req.download,
        // categories,
        latest: !!req.latest,
      });
    });
  }
}
