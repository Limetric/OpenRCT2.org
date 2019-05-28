import log from '../../utils/log';
import HTTPServer from '../../http/';

export default class QuickstartRouter {
    #router;

    get router() {
        return this.#router;
    }

    constructor(httpServer) {
        const router = this.#router = httpServer.newRouter();

        router.get('/', (req, res, next) => {
            const template = require('./index.marko');
            res.marko(template, {
                page: {
                    title: 'Quickstart Guide',
                    description: 'The Quickstart Guide is an easy guide to help with setting up your OpenRCT2 game copy for Windows, macOS and Linux.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                }
            });
        });

        router.get('/extract-rct2-files/windows', (req, res, next) => {
            const template = require('./extractFilesWindows.marko');
            res.marko(template, {
                page: {
                    title: 'Extract RCT2 files on Windows - Quickstart Guide',
                    description: 'Extract RollerCoaster Tycoon 2 files on Windows. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                }
            });
        });

        router.get('/extract-rct2-files/macOS', (req, res, next) => {
            const template = require('./extractFilesUnix.marko');
            res.marko(template, {
                page: {
                    title: 'Extract RCT2 files on macOS - Quickstart Guide',
                    description: 'Extract RollerCoaster Tycoon 2 files on macOS. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                },
                os: 'macOS'
            });
        });

        router.get('/extract-rct2-files/linux', (req, res, next) => {
            const template = require('./extractFilesUnix.marko');
            res.marko(template, {
                page: {
                    title: 'Extract RCT2 files on Linux - Quickstart Guide',
                    description: 'Extract RollerCoaster Tycoon 2 files on Linux. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                },
                os: 'linux'
            });
        });

        router.get('/install/windows', (req, res, next) => {
            const template = require('./installWindows.marko');
            res.marko(template, {
                page: {
                    title: 'Install on Windows - Quickstart Guide',
                    description: 'Install OpenRCT2 on Windows. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                }
            });
        });

        router.get('/install/macOS', (req, res, next) => {
            const template = require('./installMacOS.marko');
            res.marko(template, {
                page: {
                    title: 'Install on macOS - Quickstart Guide',
                    description: 'Install OpenRCT2 on macOS. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                }
            });
        });

        router.get('/install/linux', (req, res, next) => {
            const template = require('./installLinux.marko');
            res.marko(template, {
                page: {
                    title: 'Install on Linux - Quickstart Guide',
                    description: 'Install OpenRCT2 on Linux. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                },
                os: 'linux'
            });
        });

        const distros = new Map();
        distros.set('arch-linux', {
            title: 'Arch Linux'
        });
        distros.set('openSUSE', {
            title: 'openSUSE'
        });
        distros.set('debian-ubuntu-mint', {
            title: 'Debian, Ubuntu and Mint'
        });
        distros.set('gentoo', {
            title: 'Gentoo'
        });
        distros.set('fedora', {
            title: 'Fedora'
        });
        distros.set('nixOS', {
            title: 'NixOS'
        });

        router.param('distroIdentifier', (req, res, next, distroIdentifier) => {
            if (distroIdentifier.length > 50) {
                next(new Error('Invalid Linux distro.'));
                return;
            }

            const distro = req.distro = distros.get(distroIdentifier);
            if (!distro) {
                const error = new Error('Instructions for specified Linux distro were not found.');
                error.status = 404;
                next(error);
                return;
            }

            next();
        });

        router.get('/install/linux/:distroIdentifier', (req, res, next) => {
            const template = require('./installLinuxDistro.marko');
            res.marko(template, {
                page: {
                    title: `Install on ${req.distro.title} - Quickstart Guide`,
                    description: `Install OpenRCT2 on ${req.distro.title}. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.`,
                    path: HTTPServer.getExpressPath(req.baseUrl, req.path)
                },
                os: 'linux',
                distroIdentifier: req.params.distroIdentifier,
                distro: req.distro
            });
        });
    }
}