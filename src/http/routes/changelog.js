import HTTPServer from '../http.js';
import Database from '../../misc/database.js';
import log from '../../utils/log.js';

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
        // Getting 6 instead of 3 items as some records might not be parsed
        const records = await Database.query('SELECT * FROM `changesets` ORDER BY `versionName` DESC LIMIT 0,6');
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

            // Limit changelog to 3 items
            if (changelog.legth >= 3) {
              break;
            }
          }
        }
      } catch (error) {
        log.error(error);

        const clientError = new Error('Unable to load changelog.');
        clientError.status = 500;
        next(clientError);
        return;
      }

      res.render('changelog', {
        ...HTTPServer.instance.application.locals,
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
