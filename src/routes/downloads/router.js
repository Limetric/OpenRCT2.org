import log from '../../utils/log';
import HTTPServer from '../../http/';
import Releases from '../../misc/releases';
import StringUtils from '../../utils/string';

export default class DownloadsRouter {
    #router;

    get router() {
        return this.#router;
    }

    constructor(httpServer) {
        const router = this.#router = httpServer.newRouter();

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
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                },
                lastRelease,
                lastDevelop
            });
        });

        router.param('branch', (req, res, next, branch) => {
            if (branch.length > 50) {
                next(new Error('Invalid branch.'));
                return;
            }

            next();
        });

        //Rewrite wrong latest download link used by some websites
        router.get('/latest/:branch', (req, res) => {
            res.redirect(`../${req.params.branch}/latest`);
        });

        //Rewrite legacy `master` branch links to `releases`
        //Note: `branch` is actually an `identifier`
        router.get('/master/:branch', (req, res, next) => {
            res.redirect(`../releases/${req.params.branch}`);
        });

        router.get('/:branch', async (req, res, next) => {
            /**
             * @type {string}
             */
            const branch = req.params.branch;

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
                next(clientError);
                return;
            }

            const uflBranch = StringUtils.uppercaseFirstLetter(branch);

            const template = require('./downloadsBranchIndex.marko');
            res.marko(template, {
                page: {
                    title: `${uflBranch} downloads`,
                    description: `Latest ${releases.length} OpenRCT2 downloads in the ${uflBranch} branch.`,
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                },
                branch: uflBranch,
                releases
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
                next(clientError);
                return;
            }

            req.release = release;

            //Always redirect to gitHashShort link
            /*if (identifier !== 'latest' && identifier !== download.gitHashShort) {
                res.redirect(`../${download.gitBranch}/${download.gitHashShort}`);
                return;
            }*/

            next();
        });

        router.get('/:branch/:identifier', async (req, res, next) => {
            /**
             * @type {Release}
             */
            const release = req.release;

            const template = require('./downloadsView.marko');
            res.marko(template, {
                page: {
                    title: req.latest ? `Latest ${req.release.shortTitle} download` : `Download ${req.release.shortTitle}`,
                    description: req.latest ? `Download latest OpenRCT2 ${req.release.longTitle} of the OpenRCT2 project. The open-source adaption of RollerCoaster Tycoon 2.` : `Download OpenRCT2 ${req.release.longTitle} of the OpenRCT2 project. The open-source adaption of RollerCoaster Tycoon 2.`,
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                },
                release: release,
                //download: req.download,
                //categories,
                latest: !!req.latest
            });
        });
    }
}