const Express = require('express');
const router = Express.Router();

router.get('/', (req, res, next) => {
    const template = require('../views/index.marko');
    res.marko(template, {
        page: {
            title: 'OpenRCT2 project',
            overrideTitle: true,
            description: 'OpenRCT2 is the open-source adaption of the classic hit RollerCoaster Tycoon 2. Including online multiplayer, fast-forwarding and numerous bug fixes.',
            path: App.getExpressPath(req.baseUrl, req.path)
        }
    });
});

router.get('/about', (req, res, next) => {
    const template = require('../views/about.marko');
    res.marko(template, {
        page: {
            title: 'About',
            description: 'General information about the open-source OpenRCT2 project and it\'s authors.',
            path: App.getExpressPath(req.baseUrl, req.path)
        }
    });
});

router.get('/faq', (req, res, next) => {
    const template = require('../views/faq.marko');
    res.marko(template, {
        page: {
            title: 'FAQ',
            description: 'Frequently Asked Questions about OpenRCT2 answered.',
            path: App.getExpressPath(req.baseUrl, req.path)
        }
    });
});

router.get('/features', (req, res, next) => {
    const template = require('../views/features.marko');
    res.marko(template, {
        page: {
            title: 'Features',
            description: 'An overview of alterations made to OpenRCT2 when compared to RollerCoaster Tycoon 2.',
            path: App.getExpressPath(req.baseUrl, req.path)
        }
    });
});

module.exports = router;
