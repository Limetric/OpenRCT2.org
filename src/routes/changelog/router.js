import HTTPServer from '../../http/';
import log from '../../utils/log';
import Changelog from '../../modules/changelog/';

export default class ChangelogRouter {
    #router;

    get router() {
        return this.#router;
    }

    constructor(httpServer) {
        const router = this.#router = httpServer.newRouter();
        router.get('/', async (req, res, next) => {
            let changelog;
            let modifiedDate;
            try {
                changelog = await Changelog.content;
                modifiedDate = await Changelog.modifiedDate;
            } catch (error) {
                log.error(error);

                const clientError = new Error('Unable to load changelog.');
                clientError.status = 500;
                next(clientError);
                return;
            }

            const template = require('./changelog.marko');
            res.marko(template, {
                page: {
                    title: 'Changelog',
                    description: 'An overview of all the OpenRCT2 changes over the years.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                },
                lastUpdate: modifiedDate,
                changelog: changelog
            });
        });
    }
}
