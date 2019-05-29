import log from '../../utils/log';
import HTTPServer from '../../http/';
import Releases from '../../modules/releases/';

export default class DownloadsRouter {
    #router;

    get router() {
        return this.#router;
    }

    constructor(httpServer) {
        const router = this.#router = httpServer.newRouter();

        router.get('/', async (req, res) => {
            let lastRelease;
            try {
                lastRelease = Releases.last;
            } catch (error) {
                log.warn(error);
                lastRelease = {};
            }

            //log.debug('lastRelease', lastRelease);

            const template = require('./downloadsIndex.marko');
            res.marko(template, {
                page: {
                    title: 'Downloads',
                    description: 'Downloads for the open-source adaption of RollerCoaster Tycoon 2. Free to download.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                },
                lastRelease
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

        //Rewrite legacy `develop` branch links to `development`
        //Note: `branch` is actually an `identifier`
        router.get('/develop/:branch', (req, res, next) => {
            res.redirect(`../development/${req.params.branch}`);
        });

        router.param('identifier', async (req, res, next, identifier) => {
            let release;

            if (identifier === 'latest') {
                release = Releases.getLastByBranch(req.params.branch);
                req.latest = true;
            } else {
                release = Releases.getByBranchVersion(req.params.branch, identifier);
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