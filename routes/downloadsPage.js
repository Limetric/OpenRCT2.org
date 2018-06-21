const Express = require('express');
const router = Express.Router();

router.get('/', (req, res, next) => {
    const template = require('../views/downloadsIndex.marko');
    res.marko(template, {
        page: {
            title: 'Downloads',
            description: 'Downloads for the open-source adaption of RollerCoaster Tycoon 2. Free to download.',
            path: App.getExpressPath(req.baseUrl, req.path)
        },
    });
});

module.exports = router;
