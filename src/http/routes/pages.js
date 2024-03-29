import {Config} from '../../misc/config.js';
import HTTPServer, {Router} from '../http.js';

export class PagesRouter {
  /**
   * @type {Router}
   */
  #router;

  /**
   * Get router
   *
   * @returns {Router} Router
   */
  get router() {
    return this.#router;
  }

  /**
   * Construct pages router
   *
   * @param {HTTPServer} httpServer HTTP Server
   */
  constructor(httpServer) {
    const router = httpServer.newRouter();
    this.#router = router;
    router.get('/', (req, res) => {
      res.render('index', {
        ...httpServer.application.locals,
        req,
        page: {
          title: 'OpenRCT2 project',
          overrideTitle: true,
          description: 'OpenRCT2 is the open-source adaption of the classic hit RollerCoaster Tycoon 2. Including online multiplayer, fast-forwarding and numerous bug fixes.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });

    router.get('/about', (req, res) => {
      res.render('about', {
        ...httpServer.application.locals,
        req,
        page: {
          title: 'About',
          description: 'General information about the open-source OpenRCT2 project and it\'s authors.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });

    router.get('/faq', (req, res) => {
      res.render('faq', {
        ...httpServer.application.locals,
        req,
        page: {
          title: 'FAQ',
          description: 'Frequently Asked Questions about OpenRCT2 answered.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });

    router.get('/features', (req, res) => {
      res.render('features', {
        ...httpServer.application.locals,
        req,
        page: {
          title: 'Features',
          description: 'An overview of alterations made to OpenRCT2 when compared to RollerCoaster Tycoon 2.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });

    router.get('/download-demo', (req, res) => {
      res.redirect(301, '/downloads/demo');
    });

    // Redirect legacy forums links to new ones
    const forumsPath = '/forums';
    router.get([forumsPath, `${forumsPath}*`], (req, res) => {
      res.redirect(301, `${Config.get('site')['forumsPublicUrl']}${req.url.substring(forumsPath.length)}`);
    });
  }
}
