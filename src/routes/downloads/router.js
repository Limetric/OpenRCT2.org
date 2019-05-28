const Express = require('express');
const router = Express.Router();

import log from '../../utils/log';
import Releases from '../../modules/releases/';

router.get('/', async (req, res) => {
    let lastRelease;
    try {
        lastRelease = Releases.last;
    } catch(error) {
        log.warn(error);
        lastRelease = {};
    }

    //log.debug('lastRelease', lastRelease);

    const template = require('./downloadsIndex.marko');
    res.marko(template, {
        page: {
            title: 'Downloads',
            description: 'Downloads for the open-source adaption of RollerCoaster Tycoon 2. Free to download.',
            path: App.getExpressPath(req.baseUrl, req.path)
        },
        lastRelease
        //history,
        //latestMaster,
        //latestDevelop
    });
});

/*
router.param('gitBranch', (req, res, next, gitBranch) => {
    if (gitBranch.length > 50) {
        next(new Error('Invalid branch.'));
        return;
    }

    next();
});

//Rewrite wrong latest download link used by some websites
router.get('/latest/:gitBranch', (req, res, next) => {
    res.redirect(`../${req.params.gitBranch}/latest`);
});

router.param('identifier', async (req, res, next, identifier) => {
    let downloads;

    if (identifier === 'latest') {
        try {
            downloads = await db.promiseQuery(`
            SELECT
                \`downloadId\`,
                \`version\`,
                \`gitBranch\`,
                \`gitHash\`,
                SUBSTRING(\`gitHash\`, 1, 7) AS \`gitHashShort\`,
                \`addedTime\`
            FROM \`downloads\`
            WHERE \`gitBranch\` = ?
            ORDER BY \`downloadId\` DESC
            LIMIT 0,1`, [req.params.gitBranch]);
        } catch (error) {
            log.error(error);
            next(new Error(`Invalid download requested.`));
            return;
        }

        req.latest = true;
    } else {
        try {
            downloads = await db.promiseQuery(`
            SELECT
                \`downloadId\`,
                \`version\`,
                \`gitBranch\`,
                \`gitHash\`,
                SUBSTRING(\`gitHash\`, 1, 7) AS \`gitHashShort\`,
                \`addedTime\`
            FROM \`downloads\`
            WHERE (\`gitHash\` LIKE ? OR
                \`version\` = ?) AND \`gitBranch\` = ?
            ORDER BY \`downloadId\` DESC
            LIMIT 0,1`, [`${identifier}%`, identifier, req.params.gitBranch]);
        } catch (error) {
            log.error(error);
            next(new Error(`Invalid download requested.`));
            return;
        }
    }

    if (!downloads || !downloads.length) {
        const error = new Error('Unable to find requested download.');
        error.status = '404';
        next(error);
        return;
    }

    const download = req.download = downloads[0];

    //Always redirect to gitHashShort link
    if (identifier !== 'latest' && identifier !== download.gitHashShort) {
        res.redirect(`../${download.gitBranch}/${download.gitHashShort}`);
        return;
    }

    next();
});

router.get('/:gitBranch/:identifier', async (req, res, next) => {
    try {
        req.downloads = await db.promiseQuery(`
            SELECT CONCAT(?, b.filePath, '/', b.fileName) AS \`url\`,
                   b.fileName, b.fileSize, b.fileHash, SUBSTRING(\`b\`.\`fileHash\`, 1, 7) AS \`fileHashShort\`, b.status,
                   f.platform AS flavourPlatform, f.architecture AS flavourArchitecture,
                   f.name as flavourName, f.category AS category, f.categoryReason AS categoryReason
            FROM downloadsBuilds b
            JOIN downloadFlavours f ON (f.flavourId = b.flavourId)
            WHERE parentDownloadId = ?
            ORDER BY f.category ASC, f.identifier DESC`, [App.config.downloads.baseUrl, req.download.downloadId]);
    } catch (error) {
        log.error(error);
        next(new Error(`There was a problem with requesting download information.`));
        return;
    }

    //Categorize downloads
    const categories = new Map();
    for (const download of req.downloads) {
        const platform = download.flavourPlatform && download.category !== 'misc' ? download.flavourPlatform : 'misc';
        let downloads;
        if (!categories.has(platform)) {
            downloads = new Set();
            categories.set(platform, downloads);
        } else
            downloads = categories.get(platform);

        downloads.add(download);
    }

    const template = require('./downloadsView.marko');
    res.marko(template, {
        page: {
            title: req.latest ? `Latest ${req.download.version}-${req.download.gitBranch} download` : `Download ${req.download.version}-${req.download.gitBranch} build ${req.download.gitHashShort}`,
            description: req.latest ? `Download latest OpenRCT2 ${req.download.version}-${req.download.gitBranch} build of the OpenRCT2 project. The open-source adaption of RollerCoaster Tycoon 2.` : `Download OpenRCT2 ${req.download.version}-${req.download.gitBranch} build ${req.download.gitHashShort} of the OpenRCT2 project. The open-source adaption of RollerCoaster Tycoon 2.`,
            path: App.getExpressPath(req.baseUrl, req.path)
        },
        download: req.download,
        categories,
        latest: req.latest
    });
});*/

module.exports = router;
