import express, {Router} from 'express';
import glob from 'glob';
import http from 'node:http';
import {promisify} from 'node:util';
import {Handlers as SentryHandlers} from '@sentry/node';
import * as Eta from 'eta';
import bodyParser from 'body-parser';
import 'express-async-errors';
import path from 'node:path';
import {unlinkSync} from 'node:fs';
import Config from '../misc/config.js';
import SingletonClass from '../misc/singletonClass.js';
import PagesRouter from './routes/pages.js';
import DownloadsRouter from './routes/downloads/router.js';
import ChangelogRouter from './routes/changelog/router.js';
import QuickstartRouter from './routes/quickstart/router.js';
import AltApiRouter from './routes/altapi/router.js';
import log from '../utils/log.js';

Eta.configure({
  cache: true,
  rmWhitespace: true,
});

export default class HTTPServer extends SingletonClass {
  /**
   * @type {express.Application}
   */
  #application = express();

  /**
   * @type {http.Server}
   */
  #server;

  /**
   * Get instance
   *
   * @returns {HTTPServer} HTTP server instance
   */
  static get instance() {
    return super.instance;
  }

  /**
   * Get Express application
   *
   * @returns {express.Application} Application
   */
  get application() {
    return this.#application;
  }

  /**
   * Initialize
   *
   * @returns {Promise<void>}
   */
  async initialize() {
    this.#setupExpress();
    await this.#setupMarko();
    this.#setupRoutes();
  }

  /**
   * Setup Express
   */
  #setupExpress() {
    const {application} = this;

    application.enable('strict routing');
    application.enable('case sensitive routing');
    application.disable('x-powered-by');
    application.set('trust proxy', Config.get('http')['trustProxy']);

    this.#server = http.createServer(application);

    // Development error handler
    if (!Config.development) {
      application.use(SentryHandlers.requestHandler());
    }

    // Body Parser
    application.use(bodyParser.json());
    application.use(bodyParser.urlencoded({
      extended: false,
    }));
  }

  /**
   * Setup Marko template engine
   *
   * @returns {Promise<void>}
   */
  async #setupMarko() {
    /* MarkoCompiler.configure({
      writeToDisk: false,
    });
    MarkoRequire.install({
      compilerOptions: {
        writeToDisk: false,
      },
    }); */

    const {application} = this;
    application.engine('eta', Eta.renderFile);
    application.set('view engine', 'eta');
    application.set('views', './views');

    // Set Marko globals
    // application.locals.media = Config.media;
    application.locals.site = {
      title: Config.get('site')['title'],
      googleAnalyticsTrackingId: Config.get('site')['googleAnalyticsTrackingId'],
      // description: '',
      publicUrl: Config.get('site')['publicUrl'],
    };

    // Find JS and CSS bundles
    const files = await promisify(glob)('public/resources/main.*.bundle.min.+(js|css)');

    /** @type {string} */
    let jsBundle;

    /** @type {string} */
    let cssBundle;
    for (const file of files) {
      if (file.includes('.js')) {
        jsBundle = path.basename(file);
      } else if (file.includes('.css')) {
        cssBundle = path.basename(file);
      }
    }

    if (!jsBundle || !cssBundle) {
      throw new Error('JS and/or CSS bundle(s) invalid');
    }

    application.locals.resources = {
      jsBundle,
      cssBundle,
    };

    application.locals.author = {
      name: 'OpenRCT2 Webmaster',
      emailAddress: 'mail@openrct2.org',
    };
  }

  /**
   * Listen
   *
   * @returns {Promise<void>}
   */
  listen() {
    return new Promise((resolve, reject) => {
      /** @type {object} */
      let listenOptions;

      /** @type {string} */
      let unixSocketPath;
      if (typeof (Config.get('http').path) === 'string') {
        unixSocketPath = Config.get('http').path;
      } else if (typeof (Config.get('http').path) === 'boolean' && Config.get('http').path) {
        unixSocketPath = path.join(path.dirname(require.main.filename), '..', 'node-openrct.socket');
      }

      if (typeof (unixSocketPath) === 'string') {
        try {
          unlinkSync(unixSocketPath);
        } catch (error) {
          if (error.code !== 'ENOENT') {
            log.warn(error);
          }
        }
        listenOptions = {
          path: unixSocketPath,
          readableAll: true,
          writableAll: true,
        };
      } else {
        listenOptions = {
          host: Config.get('http').address,
          port: process.env.PORT ?? Config.get('http').port,
        };
      }

      const server = this.#server;
      server.listen(listenOptions);
      server.on('error', (error) => {
        if (error.syscall !== 'listen') {
          throw error;
        }

        switch (error.code) {
          case 'EACCES':
            reject(new Error('Host requires elevated privileges'));
            break;
          case 'EADDRINUSE':
            reject(new Error('Host is already in use'));
            break;
          default:
            reject(error);
            break;
        }
      });
      server.on('listening', () => {
        const address = server.address();
        if (typeof (address.port) === 'number') {
          log.info(`Listening on ${address.address} port ${address.port} (${address.family})`);
        } else {
          log.info(`Listening on UNIX-domain socket '${unixSocketPath}'`);
        }

        resolve();
      });
    });
  }

  /**
   * Get a new router
   *
   * @returns {Router} Express router
   */
  newRouter() {
    const {application} = this;
    return new Router({
      strict: application.get('strict routing'),
      caseSensitive: application.get('case sensitive routing'),
    });
  }

  /**
   * Helper function
   * ToDo: Move to utility class
   *
   * @todo Improve function naming and description
   * @param {string} baseUrl Base URL
   * @param {string} expressPath Express path
   * @returns {string} Express path URL
   */
  static getExpressPath(baseUrl, expressPath) {
    return baseUrl.replace(/\/$/, '') + expressPath.replace(/\/$/, '');
  }

  #setupRoutes() {
    const {application} = this;

    application.use('/', express.static('./public', {
      index: false,
      cacheControl: false,
      setHeaders: (res) => {
        if (!Config.development) {
          // Cache 7 days
          res.setHeader('cache-control', 'public, max-age=604800, immutable');
        }
      },
    }));

    // Redirect trailing slash requests
    application.use((req, res, next) => {
      if (req.path.substr(-1) === '/' && req.path.length > 1 && req.path !== '/altapi/') {
        const query = req.url.slice(req.path.length);
        res.redirect(301, req.path.slice(0, -1) + query);
      } else {
        next();
      }
    });

    // Force use of the main domain
    if (Config.get('http')['forcePrimaryDomain']) {
      const {primaryDomain} = Config.get('http');
      if (!primaryDomain) {
        log.warn(new Error('Forcing primary domain without specifying'));
      }

      application.use((req, res, next) => {
        if (req.hostname && req.hostname !== primaryDomain) {
          res.redirect(301, `https://${primaryDomain}${req.url}`);
        } else {
          next();
        }
      });
    }

    application.use('/', new PagesRouter(this).router);
    /* application.use('/downloads', new DownloadsRouter(this).router);
    application.use('/changelog', new ChangelogRouter(this).router);
    application.use('/quickstart', new QuickstartRouter(this).router);
    application.use('/altapi', new AltApiRouter(this).router); */

    // Error Handler is our last stop
    application.use((req, res, next) => {
      const error = new Error('Not Found');
      error.originalUrl = req.originalUrl;
      error.path = req.path;
      error.status = 404;
      next(error);
    });

    // Deal with errors. DO NOT REMOVE THE 4TH PARAMETER!
    // eslint-disable-next-line no-unused-vars
    application.use((error, req, res, next) => {
      if (Config.development) {
        log.warn(error);
      } else {
        log.info(error);
      }

      if (!error.status) {
        error.status = 500;
      }

      switch (error.status) {
        case 403:
          error.statusMessage = 'No permission';
          break;
        case 404:
          error.statusMessage = 'Not found';
          break;
        case 500:
          error.statusMessage = 'An internal server error occurred';
          break;
        default:
          error.statusMessage = 'A server error occurred';
          break;
      }

      if (!error.message) {
        error.message = 'An unknown problem occurred. Please try again later.';
      }

      res.status(error.status);
      res.render('error', {
        ...application.locals,
        error,
        isDevelopment: Config.development,
        page: {
          title: error.message,
          description: error.statusMessage,
          path: HTTPServer.getExpressPath(req.baseUrl, req.path),
        },
      });
    });
  }
}
