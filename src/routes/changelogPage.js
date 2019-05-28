const Express = require('express');
const router = Express.Router();

import ChangelogScraper from '../modules/changelogScraper';

router.get('/', async (req, res, next) => {
    const filename = ChangelogScraper.getFilename();

    let modifiedDate;
    try {
        modifiedDate = await new Promise((resolve, reject) => {
            const fs = require('fs');
            fs.stat(filename, (error, stats) => {
                if (error)
                    return reject(error);

                resolve(stats.mtime || stats.ctime || stats.birthtime);
            });
        });
    } catch(error) {
        log.error(error);
    }

    const jsonfile = require('jsonfile');
    jsonfile.readFile(filename, (error, changelog) => {
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
            lastUpdate: modifiedDate,
            changelog: changelog
        });
    });
});

module.exports = router;
