import HTTPServer from '../../http/';
import log from '../../utils/log';
import Firestore from '../../misc/firestore';

export default class ChangelogRouter {
    #router;

    get router() {
        return this.#router;
    }

    /**
     * @type {FirebaseFirestore.CollectionReference}
     */
    #collection = Firestore.collection('changesets');

    constructor(httpServer) {
        const router = this.#router = httpServer.newRouter();
        router.get('/', async (req, res, next) => {


            const changelog = [];
            let lastUpdated;
            try {
                const snapshot = await this.#collection.orderBy('created', 'desc').get();
                if (!snapshot.empty) {
                    for (const doc of snapshot.docs) {
                        const docData = doc.data();
                        const updated = docData['updated'];
                        if (updated instanceof Date && (!lastUpdated || updated > lastUpdated))
                            lastUpdated = updated;

                        changelog.push({
                            versionName: docData['versionName'],
                            changes: docData['changes'],
                            created: docData['created'],
                            updated
                        });
                    }
                }
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
                lastUpdated,
                changelog: changelog
            });
        });
    }
}
