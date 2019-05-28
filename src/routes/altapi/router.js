import log from '../../utils/log';

export default class AltApiRouter {
    #router;

    get router() {
        return this.#router;
    }

    getLatestDownload(req, res) {
        const gitBranch = req.body.gitBranch || req.params.gitBranch;
        const flavourId = req.body.flavourId || req.params.flavourId;
        res.json({
            error: 1,
            errorMessage: 'Download will be fixed in 24h'
        });
    }

    constructor(httpServer) {
        const router = this.#router = httpServer.newRouter();
        router.get('/', async (req, res, next) => {
            const command = req.body.command || req.query.command;

            log.debug('Command', command, req.body.command, req.query.command);

            if (command === 'push-build') {
                res.json({
                    error: 1,
                    errorMessage: 'Pushing is currently disabled.'
                });
            } else if (command === 'get-latest-download') {
                this.getLatestDownload(req, res);
            } else {
                res.json({
                    error: 1,
                    errorMessage: 'Unknown command.'
                });
            }
        });
    }
}
