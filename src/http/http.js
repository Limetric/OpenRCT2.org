import express, {Router} from 'express';
import {createServer} from 'node:http';
import {Handlers as SentryHandlers} from '@sentry/node';
import * as Eta from 'eta';
import 'express-async-errors';
import minifyHTML from 'express-minify-html-2';
import {Config} from '../misc/config.js';
import {PagesRouter} from './routes/pages.js';
import {DownloadsRouter} from './routes/downloads.js';
import {ChangelogRouter} from './routes/changelog.js';
import {QuickstartRouter} from './routes/quickstart.js';
import {AltApiRouter} from './routes/altapi.js';
import {VersionUtils} from '../utils/version.js';
import {FrontendManager} from './frontend.js';

/**
 * @typedef {import('node:http').Server} NodeHTTPServer
 */

export default class HTTPServer {
  static {
    Eta.configure({
      cache: true,
      rmWhitespace: true,
    });
  }

  /**
   * @type {HTTPServer}
   */
  static #instance;

  /**
   * Get default HTTP server instance
   *
   * @returns {HTTPServer} Instance
   */
  static get instance() {
    if (!this.#instance) {
      this.#instance = new HTTPServer();
    }
    return this.#instance;
  }

  /**
   * @type {express.Application}
   */
  #application = express();

  /**
   * @type {NodeHTTPServer}
   */
  #server;

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
    await this.#setupRenderer();
    this.#setupMinification();
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

    this.#server = createServer(application);

    // Sentry handlers
    application.use(SentryHandlers.requestHandler());
    application.use(SentryHandlers.tracingHandler());

    // Body Parser
    application.use(express.json());
    application.use(express.urlencoded({
      extended: false,
    }));
  }

  /**
   * Setup template renderer
   *
   * @returns {Promise<void>}
   */
  async #setupRenderer() {
    const {application} = this;
    application.engine('eta', Eta.renderFile);
    application.set('view engine', 'eta');
    application.set('views', './views');

    const siteConfig = Config.get('site');

    // Set site global
    application.locals.site = {
      title: siteConfig['title'],
      description: siteConfig['description'],
      publicUrl: siteConfig['publicUrl'],
      version: VersionUtils.getVersion(),
    };

    // Set frontend entrypoint global
    application.locals.entryPoints = (await FrontendManager.getEntryPoints())?.['main'];

    // Set author global
    application.locals.author = siteConfig['author'];
  }

  /**
   * Setup HTML minification
   */
  #setupMinification() {
    this.application.use(minifyHTML({
      override: true,
      htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true,
      },
    }));
  }

  /**
   * Listen
   *
   * @returns {Promise<void>}
   */
  listen() {
    return new Promise((resolve, reject) => {
      const server = this.#server;
      server.listen(80);
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
        console.info(`Listening on port ${address.port}`);

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

  /**
   * Setup routes
   */
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
        console.warn(new Error('Unable to enforce unspecified primary domain'));
      } else {
        application.use((req, res, next) => {
          if (req.hostname && req.hostname !== primaryDomain) {
            res.redirect(301, `https://${primaryDomain}${req.url}`);
          } else {
            next();
          }
        });
      }
    }

    application.use('/', new PagesRouter(this).router);
    application.use('/downloads', new DownloadsRouter(this).router);
    application.use('/changelog', new ChangelogRouter(this).router);
    application.use('/quickstart', new QuickstartRouter(this).router);
    application.use('/altapi', new AltApiRouter(this).router);

    // Error Handler is our last stop
    application.use((req, res, next) => {
      const error = new Error('Not Found');
      error.originalUrl = req.originalUrl;
      error.path = req.path;
      error.status = 404;
      next(error);
    });

    // Sentry error handler
    application.use(SentryHandlers.errorHandler({
      shouldHandleError(error) {
        // Capture all 404 and >= 500 errors
        if (error.status === 404 || error.status >= 500) {
          return true;
        }
        return false;
      },
    }));

    // Deal with errors. DO NOT REMOVE THE 4TH PARAMETER!
    // eslint-disable-next-line no-unused-vars
    application.use((error, req, res, next) => {
      // Set default error code 500
      if (!error.status) {
        error.status = 500;
      }

      // Determine status message
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

      // Default error message
      error.message ??= 'An unknown problem occurred. Please try again later.';

      // Include Sentry error id
      error.sentryId = res.sentry;

      console.warn(error);

      res.status(error.status);
      res.render('error', {
        ...application.locals,
        req,
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

export {Router};
