import HTTPServer from '../http/';

export default class StaticRouter {
    #router;

    get router() {
        return this.#router;
    }

    constructor(httpServer) {
        const router = this.#router = httpServer.newRouter();
        router.get('/', (req, res) => {
            const template = require('./index.marko');
            res.marko(template, {
                page: {
                    title: 'OpenRCT2 project',
                    overrideTitle: true,
                    description: 'OpenRCT2 is the open-source adaption of the classic hit RollerCoaster Tycoon 2. Including online multiplayer, fast-forwarding and numerous bug fixes.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                }
            });
        });

        router.get('/about', (req, res) => {
            const template = require('./about.marko');
            res.marko(template, {
                page: {
                    title: 'About',
                    description: 'General information about the open-source OpenRCT2 project and it\'s authors.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                }
            });
        });

        router.get('/faq', (req, res) => {
            const template = require('./faq.marko');
            res.marko(template, {
                page: {
                    title: 'FAQ',
                    description: 'Frequently Asked Questions about OpenRCT2 answered.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                }
            });
        });

        router.get('/features', (req, res) => {
            const template = require('./features.marko');
            res.marko(template, {
                page: {
                    title: 'Features',
                    description: 'An overview of alterations made to OpenRCT2 when compared to RollerCoaster Tycoon 2.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                }
            });
        });

        router.get('/download-demo', (req, res) => {
            const template = require('./downloadDemo.marko');
            res.marko(template, {
                page: {
                    title: 'Download RCT2 Demo',
                    description: 'By downloading the free RollerCoaster Tycoon 2 TTP Demo you can play the full OpenRCT2 game.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                }
            });
        });
    }
}