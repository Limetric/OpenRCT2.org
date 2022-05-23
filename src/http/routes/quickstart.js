import HTTPServer from '../http.js';

export class QuickstartRouter {
  #router;

  get router() {
    return this.#router;
  }

  /** @type {Map<string, object>} */
  static #distros = new Map();

  static {
    this.#distros.set('arch-linux', {
      title: 'Arch Linux',
    });
    this.#distros.set('openSUSE', {
      title: 'openSUSE',
    });
    this.#distros.set('debian-ubuntu-mint', {
      title: 'Debian, Ubuntu and Mint',
    });
    this.#distros.set('gentoo', {
      title: 'Gentoo',
    });
    this.#distros.set('fedora', {
      title: 'Fedora',
    });
    this.#distros.set('nixOS', {
      title: 'NixOS',
    });
  }

  constructor(httpServer) {
    const router = httpServer.newRouter();
    this.#router = router;

    router.get('/', (req, res) => {
      res.render('quickstart/index', {
        ...HTTPServer.instance.application.locals,
        page: {
          title: 'Quickstart Guide',
          description: 'The Quickstart Guide is an easy guide to help with setting up your OpenRCT2 game copy for Windows, macOS and Linux.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });

    router.get('/extract-rct2-files/windows', (req, res) => {
      res.render('quickstart/extractFilesWindows', {
        ...HTTPServer.instance.application.locals,
        page: {
          title: 'Extract RCT2 files on Windows - Quickstart Guide',
          description: 'Extract RollerCoaster Tycoon 2 files on Windows. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });

    router.get('/extract-rct2-files/macOS', (req, res) => {
      res.render('quickstart/extractFilesUnix', {
        ...HTTPServer.instance.application.locals,
        page: {
          title: 'Extract RCT2 files on macOS - Quickstart Guide',
          description: 'Extract RollerCoaster Tycoon 2 files on macOS. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
        os: 'macOS',
      });
    });

    router.get('/extract-rct2-files/linux', (req, res) => {
      res.render('quickstart/extractFilesUnix', {
        ...HTTPServer.instance.application.locals,
        page: {
          title: 'Extract RCT2 files on Linux - Quickstart Guide',
          description: 'Extract RollerCoaster Tycoon 2 files on Linux. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
        os: 'linux',
      });
    });

    router.get('/install/windows', (req, res) => {
      res.render('quickstart/installWindows', {
        ...HTTPServer.instance.application.locals,
        page: {
          title: 'Install on Windows - Quickstart Guide',
          description: 'Install OpenRCT2 on Windows. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });

    router.get('/install/macOS', (req, res) => {
      res.render('quickstart/installMacOS', {
        ...HTTPServer.instance.application.locals,
        page: {
          title: 'Install on macOS - Quickstart Guide',
          description: 'Install OpenRCT2 on macOS. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });

    router.get('/install/linux', (req, res) => {
      res.render('quickstart/installLinux', {
        ...HTTPServer.instance.application.locals,
        page: {
          title: 'Install on Linux - Quickstart Guide',
          description: 'Install OpenRCT2 on Linux. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.',
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
        os: 'linux',
      });
    });

    router.param('distroIdentifier', (req, res, next, distroIdentifier) => {
      if (distroIdentifier.length > 50) {
        throw new Error('Invalid Linux distro.');
      }

      const distro = QuickstartRouter.#distros.get(distroIdentifier);
      if (!distro) {
        const error = new Error('Instructions for specified Linux distro were not found.');
        error.status = 404;
        next(error);
        return;
      }
      req.distro = distro;

      next();
    });

    router.get('/install/linux/:distroIdentifier', (req, res) => {
      res.render('quickstart/installLinuxDistro', {
        ...HTTPServer.instance.application.locals,
        page: {
          title: `Install on ${req.distro.title} - Quickstart Guide`,
          description: `Install OpenRCT2 on ${req.distro.title}. Read the Quickstart Guide to get help setting up your OpenRCT2 game copy.`,
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
        os: 'linux',
        distroIdentifier: req.params.distroIdentifier,
        distro: req.distro,
      });
    });
  }
}
