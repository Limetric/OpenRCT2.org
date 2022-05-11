import HTTPServer from '../../http';
import Database from '../../../misc/database';
import log from '../../../utils/log';

export default class ChangelogRouter {
  #router;

  get router() {
    return this.#router;
  }

  constructor(httpServer) {
    const router = httpServer.newRouter();
    this.#router = router;
    router.get('/', async (req, res, next) => {
      const changelog = [];
      let lastUpdated;
      try {
        const records = await Database.instance.query('SELECT * FROM `changesets` ORDER BY `versionName` DESC');
        if (records) {
          let isFirst = true;
          for (const record of records) {
            const {updated} = record;
            if (updated instanceof Date && (!lastUpdated || updated > lastUpdated)) {
              lastUpdated = updated;
            }

            if (record['versionName'].includes('development') && !isFirst) {
              continue;
            }
            isFirst = false;

            changelog.push({
              versionName: record['versionName'],
              changes: record['changes'],
              created: record['created'],
              updated,
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
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
        lastUpdated,
        changelog,
      });
    });
  }
}
