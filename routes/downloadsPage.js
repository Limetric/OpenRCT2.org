const Express = require('express');
const router = Express.Router();

router.get('/', async (req, res, next) => {
    //Get from database
    let history;
    let latestMaster;
    let latestDevelop;
    try {
        history = await db.promiseQuery(`
            SELECT
                \`downloads\`.\`downloadId\`,
                ANY_VALUE(\`downloads\`.\`version\`) AS \`version\`,
                ANY_VALUE(\`downloads\`.\`gitBranch\`) AS \`gitBranch\`,
                ANY_VALUE(\`downloads\`.\`gitHash\`) AS \`gitHash\`,
                SUBSTRING(ANY_VALUE(\`downloads\`.\`gitHash\`), 1, 7) AS \`gitHashShort\`,
                ANY_VALUE(\`downloads\`.\`addedTime\`) AS \`addedTime\`,
                ANY_VALUE(\`downloadsBuilds\`.\`status\`) AS \`status\`
            FROM \`downloads\`
            JOIN \`downloadsBuilds\` ON \`downloadsBuilds\`.\`parentDownloadId\` = \`downloads\`.\`downloadId\`
            GROUP BY \`downloads\`.\`downloadId\`
            ORDER BY \`downloads\`.\`downloadId\` DESC
            LIMIT 0,25`);

        const latestDevelops = await db.promiseQuery(`
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
            LIMIT 0,1`, ['develop']);
        if (latestDevelops)
            latestDevelop = latestDevelops[0];

        const latestMasters = await db.promiseQuery(`
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
            LIMIT 0,1`, ['master']);
        if (latestMasters)
            latestMaster = latestMasters[0];
    } catch (error) {
        log.error(error);
        next(new Error("Database problem."));
        return;
    }

    const template = require('../views/downloadsIndex.marko');
    res.marko(template, {
        page: {
            title: 'Downloads',
            description: 'Downloads for the open-source adaption of RollerCoaster Tycoon 2. Free to download.',
            path: App.getExpressPath(req.baseUrl, req.path)
        },
        history,
        latestMaster,
        latestDevelop
    });
});

module.exports = router;
