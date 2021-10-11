import HTTPServer from '../http';
import Config from '../../misc/config';

export default class StaticRouter {
  #router;

  get router() {
    return this.#router;
  }

  constructor(httpServer) {
    const router = httpServer.newRouter();
    this.#router = router;
    router.get('/', (req, res) => {
      const template = require('./index.marko');
      res.marko(template, {
        page: {
          title: 'OpenRCT2 project',
          overrideTitle: true,
          description: 'OpenRCT2 is the open-source adaption of the classic hit RollerCoaster Tycoon 2. Including online multiplayer, fast-forwarding and numerous bug fixes.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });

    router.get('/about', (req, res) => {
      const template = require('./about.marko');
      res.marko(template, {
        page: {
          title: 'About',
          description: 'General information about the open-source OpenRCT2 project and it\'s authors.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });

    router.get('/faq', (req, res) => {
      const template = require('./faq.marko');
      res.marko(template, {
        page: {
          title: 'FAQ',
          description: 'Frequently Asked Questions about OpenRCT2 answered.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });

    router.get('/features', (req, res) => {
      const template = require('./features.marko');
      res.marko(template, {
        page: {
          title: 'Features',
          description: 'An overview of alterations made to OpenRCT2 when compared to RollerCoaster Tycoon 2.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });

    // Redirect legacy forums links to new ones
    const forumsPath = '/forums';
    router.get([forumsPath, `${forumsPath}*`], (req, res) => {
      res.redirect(301, `${Config.get('site')['forumsPublicUrl']}${req.url.substring(forumsPath.length)}`);
    });
  }
}
