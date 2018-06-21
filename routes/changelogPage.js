const Express = require('express');
const router = Express.Router();

router.get('/', (req, res, next) => {
    const jsonfile = require('jsonfile');
    jsonfile.readFile(App.modules.changelogScraper.getFilename(), (error, changelog) => {
        if (error) {
            const error = new Error('Unable to load changelog.');
            error.status = 500;
            next(error);
            return;
        }

        const template = require('../views/changelog.marko');
        res.marko(template, {
            page: {
                title: 'Changelog',
                description: 'An overview of all the OpenRCT2 changes over the years.',
                path: App.getExpressPath(req.baseUrl, req.path)
            },
            changelog: changelog
        });
    });
});

module.exports = router;
