import log from '../utils/log';
import Express from 'express';
import Path from 'path';
import Config from '../config';
import SingletonClass from '../misc/singletonClass';
import StaticRouter from '../routes/static';
import DownloadsRouter from '../routes/downloads/router';
import ChangelogRouter from '../routes/changelog/router';
import QuickstartRouter from '../routes/quickstart/router';

export default class HTTPServer extends SingletonClass {
    /**
     * @type {*}
     */
    #express = Express();

    /**
     * @type {*}
     */
    #server;

    get express() {
        return this.#express;
    }

    constructor() {
        super();

        this.#setupExpress();
        this.#setupMarko();
        this.#setupRoutes();
    }

    #setupExpress() {
        const express = this.#express;
        express.enable('strict routing');
        express.enable('case sensitive routing');
        express.disable('x-powered-by');
        express.set('trust proxy', Config.http['trustProxy']);

        this.#server = require('http').createServer(express);

        //Body Parser
        const bodyParser = require('body-parser');
        express.use(bodyParser.json());
        express.use(bodyParser.urlencoded({
            extended: false
        }));
    }

    #setupMarko() {
        require('marko/compiler').configure({
            writeToDisk: false
        });
        require('marko/node-require').install({
            compilerOptions: {
                writeToDisk: false
            }
        });

        //Marko render engine
        const markoExpress = require('marko/express');
        const express = this.express;
        express.use(markoExpress());
        express.locals.layout = Path.join(__dirname, '../layouts/layout.marko');

        //Set Marko globals
        express.locals.media = Config.media;
        express.locals.site = {
            title: Config.site['title'],
            googleAnalyticsTrackingId: Config.site['googleAnalyticsTrackingId'],
            //description: '',
            publicUrl: Config.site['publicUrl']
        };
        express.locals.author = {
            name: 'OpenRCT2 Webmaster',
            emailAddress: 'mail@openrct2.org'
        };
    }

    listen() {
        return new Promise((resolve, reject) => {
            this.#server.listen(Config.http.port, Config.http.address);
            this.#server.on('error', (error) => {
                if (error.syscall !== 'listen')
                    throw error;

                switch (error.code) {
                    case 'EACCES':
                        reject(new Error(`Host requires elevated privileges`));
                        break;
                    case 'EADDRINUSE':
                        reject(new Error(`Host is already in use`));
                        break;
                    default:
                        throw error;
                }
            });
            this.#server.on('listening', () => {
                const addr = this.#server.address();
                const bind = typeof(addr.port) === 'string' ? `pipe ${addr.port}` : `port ${addr.port}`;
                log.info(`Listening on ${addr.address} ${bind} (${addr.family})`);
                resolve();
            });
        });
    }

    /**
     * Get a new router
     * @returns {Router}
     */
    newRouter() {
        return Express.Router({
            strict: this.express.get('strict routing'),
            caseSensitive: this.express.get('case sensitive routing')
        });
    }

    /**
     * Helper function
     * ToDo: Move to utility class
     * @param {string} baseUrl
     * @param {string} path
     * @returns {string}
     */
    static getExpressPath(baseUrl, path) {
        return baseUrl.replace(/\/$/, '') + path.replace(/\/$/, '')
    }

    #setupRoutes() {
        this.express.use('/', Express.static(Path.join(__dirname, '../..', 'public'), {
            etag: !Config.development
        }));

        //Redirect trailing slash requests
        this.express.use((req, res, next) => {
            if (req.path.substr(-1) === '/' && req.path.length > 1) {
                const query = req.url.slice(req.path.length);
                res.redirect(301, req.path.slice(0, -1) + query);
            } else
                next();
        });

        this.express.use('/', new StaticRouter(this).router);
        this.express.use('/downloads', new DownloadsRouter(this).router);
        this.express.use('/changelog', new ChangelogRouter(this).router);
        this.express.use('/quickstart', new QuickstartRouter(this).router);

        //Error Handler is our last stop
        this.express.use((req, res, next) => {
            const error = new Error('Not Found');
            error.originalUrl = req.originalUrl;
            error.path = req.path;
            error.status = 404;
            next(error);
        });

        //Deal with errors
        this.express.use((error, req, res) => {
            if (Config.development)
                log.warn(error);
            else
                log.info(error);

            if (!error.status)
                error.status = 500;

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

            if (!error.message)
                error.message = 'An unknown problem occurred. Please try again later.';

            res.status(error.status);
            const layout = require('./error.marko');
            res.marko(layout, {
                error,
                isDevelopment: this.isDevelopment,
                page: {
                    title: error.message,
                    description: error.statusMessage,
                    path: this.constructor.getExpressPath(req.baseUrl, req.path)
                }
            });
        });

        /*this.#express.use('/', Express.static('./public', {
            etag: !App.isDevelopment
        }));

        //Get medium by domain
        this.#express.use(async (req, res, next) => {
            const medium = req.medium = Media.getByDomain(req.hostname);
            if (!medium || !medium.enabled) {
                res.setHeader('Content-Type', 'text/plain');
                res.status(404).send('The Globalis chat website you requested is currently not available.');
                log.warn(`Domain '${req.hostname}' requested but not configured`);
                return;
            }

            next();
        });

        //Force secure and/or domain
        this.#express.use((req, res, next) => {
            const host = req.get('host');

            const realDomain = new Map(Object.entries(Config.http.redirectDomains)).get(host);
            if (realDomain) {
                res.redirect(301, `https://${realDomain + req.url}`);
                return;
            } else if (Config.http.forceSecure && !req.secure && req.get('x-forwarded-proto') !== 'https') {
                res.redirect(301, `https://${host + req.url}`);
                return;
            }

            next();
        });

        this.#express.use('/', new StaticRoute(this).router);

        //Strict routing redirects
        this.#express.get(['/chats'], (req, res) => {
            const query = req.url.slice(req.path.length);
            res.redirect(301, req.path + '/' + query);
        });

        //Remove trailing slash if not found
        this.#express.use((req, res, next) => {
            const pathLength = req.path.length;
            if (pathLength > 1 && req.path.lastIndexOf('/') === (pathLength - 1)) {
                const query = req.url.slice(pathLength);
                res.redirect(301, req.path.slice(0, -1) + query);
            } else
                next();
        });

        //Error Handler is our last stop
        this.#express.use((req, res, next) => {
            const error = new Error('Not Found');
            error.originalUrl = req.originalUrl;
            error.path = req.path;
            error.status = 404;
            next(error);
        });

        //Deal with errors
        this.#express.use((error, req, res) => {
            log.info(`Express: ${JSON.stringify(error)}`);

            if (!error.status)
                error.status = 500;

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

            if (!error.message)
                error.message = 'An unknown problem occurred. Please try again later.';

            res.status(error.status);
            const layout = require('./error.marko');
            res.marko(layout, {
                medium: req.medium,
                error,
                isDevelopment: this.isDevelopment,
                page: {
                    title: error.message,
                    description: error.statusMessage,
                    path: this.getExpressPath(req.baseUrl, req.path)
                }
            });
        });*/
    }
}