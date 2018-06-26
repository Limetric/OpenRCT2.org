const Express = require('express');
const router = Express.Router();

router.get('/', (req, res, next) => {
    const template = require('../views/quickstart/index.marko');
    res.marko(template, {
        page: {
            title: 'Quickstart Guide',
            description: 'The Quickstart Guide is an easy guide to help with setting up your OpenRCT2 game copy for Windows, macOS and Linux.',
            path: App.getExpressPath(req.baseUrl, req.path)
        }
    });
});

router.get('/extract-rct2-files/windows', (req, res, next) => {
    const template = require('../views/quickstart/extractFilesWindows.marko');
    res.marko(template, {
        page: {
            title: 'Extract RCT2 files on Windows - Quickstart Guide',
            description: 'Extract RollerCoaster Tycoon 2 files on Windows. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
            path: App.getExpressPath(req.baseUrl, req.path)
        }
    });
});

router.get('/extract-rct2-files/macOS', (req, res, next) => {
    const template = require('../views/quickstart/extractFilesUnix.marko');
    res.marko(template, {
        page: {
            title: 'Extract RCT2 files on macOS - Quickstart Guide',
            description: 'Extract RollerCoaster Tycoon 2 files on macOS. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
            path: App.getExpressPath(req.baseUrl, req.path)
        },
        os: 'macOS'
    });
});

router.get('/extract-rct2-files/linux', (req, res, next) => {
    const template = require('../views/quickstart/extractFilesUnix.marko');
    res.marko(template, {
        page: {
            title: 'Extract RCT2 files on Linux - Quickstart Guide',
            description: 'Extract RollerCoaster Tycoon 2 files on Linux. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
            path: App.getExpressPath(req.baseUrl, req.path)
        },
        os: 'linux'
    });
});

router.get('/install/windows', (req, res, next) => {
    const template = require('../views/quickstart/installWindows.marko');
    res.marko(template, {
        page: {
            title: 'Install on Windows - Quickstart Guide',
            description: 'Install OpenRCT2 on Windows. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
            path: App.getExpressPath(req.baseUrl, req.path)
        }
    });
});

router.get('/install/macOS', (req, res, next) => {
    const template = require('../views/quickstart/extractFilesUnix.marko');
    res.marko(template, {
        page: {
            title: 'Install on macOS - Quickstart Guide',
            description: 'Install OpenRCT2 on macOS. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
            path: App.getExpressPath(req.baseUrl, req.path)
        }
    });
});

router.get('/install/linux', (req, res, next) => {
    const template = require('../views/quickstart/extractFilesUnix.marko');
    res.marko(template, {
        page: {
            title: 'Install on Linux - Quickstart Guide',
            description: 'Install OpenRCT2 on Linux. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
            path: App.getExpressPath(req.baseUrl, req.path)
        },
        os: 'linux'
    });
});

module.exports = router;