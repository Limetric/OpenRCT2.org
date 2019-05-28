#!/usr/bin/env node

const appVersion = require('../package').version;
console.log('#############################');
console.log(`OpenRCT2.org v${appVersion}`);
console.log('#############################');

import '@babel/polyfill';
import 'source-map-support/register';

import log from './utils/log';
import Config from './config';

(async () => {
    log.info(`Current environment: ${Config.environment}`);
})();

class App {
    static initExpress() {
        const Express = require('express');
        this.express = Express();
        this.express.set('x-powered-by', false);
        this.express.set('trust proxy', Config.http['trustProxy'] ? 1 : 0);

        this.server = require('http').createServer(this.express);

        //Body Parser
        const bodyParser = require('body-parser');
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({
            extended: false
        }));

        //Cookie Parser
        const cookieParser = require('cookie-parser');
        this.express.use(cookieParser());

        //Engine
        require('marko/node-require').install();
        const markoExpress = require('marko/express'); //enable res.marko
        this.express.use(markoExpress());

        this.express.locals.layout = '/views/layouts/defaultLayout.marko';

        this.express.locals.site = {
            title: Config.site.title,
            googleAnalyticsTrackingId: Config.site.googleAnalyticsTrackingId,
            //description: '',
            publicUrl: Config.site.publicUrl
        };
        this.express.locals.author = {
            name: 'OpenRCT2 Webmaster',
            emailAddress: 'mail@openrct2.org'
        };
    }

    static listenExpress() {
        return new Promise((resolve, reject) => {
            this.server.listen(Config.http['port'], Config.http['address']);
            this.server.on('error', (error) => {
                if (error.syscall !== 'listen')
                    throw error;

                switch (error.code) {
                    case 'EACCES':
                        reject(`Host requires elevated privileges`);
                        break;
                    case 'EADDRINUSE':
                        reject(`Host is already in use`);
                        break;
                    default:
                        throw error;
                }
            });
            this.server.on('listening', () => {
                const addr = this.server.address();
                const bind = typeof(addr.port) === 'string' ? `pipe ${addr.port}` : `port ${addr.port}`;
                log.info(`Listening on ${addr.address} ${bind} (${addr.family})`);
                resolve();
            });
        });
    }

    static initRoutes() {
        const express = require('express');
        const path = require('path');
        this.express.use('/', express.static(path.join(__dirname, '..', 'public'), {
            etag: !App.isDevelopment
        }));

        //Redirect trailing slash requests
        this.express.use((req, res, next) => {
            if (req.path.substr(-1) === '/' && req.path.length > 1) {
                const query = req.url.slice(req.path.length);
                res.redirect(301, req.path.slice(0, -1) + query);
            } else
                next();
        });

        this.express.use('/', require('./routes/staticPages'));
        this.express.use('/changelog', require('./routes/changelogPage'));
        this.express.use('/downloads', require('./routes/downloads/router'));
        this.express.use('/quickstart', require('./routes/quickstart/router'));

        //Error Handler is our last stop
        this.express.use((req, res, next) => {
            const error = new Error('Not Found');
            error.originalUrl = req.originalUrl;
            error.path = req.path;
            error.status = 404;
            next(error);
        });

        //Deal with errors
        this.express.use((error, req, res, next) => {
            log.warn(`Express: ${JSON.stringify(error)}`);

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
            const layout = require('./routes/error.marko');
            res.marko(layout, {
                error,
                isDevelopment: this.isDevelopment,
                page: {
                    title: error.message,
                    description: error.statusMessage,
                    path: this.getExpressPath(req.baseUrl, req.path)
                }
            });
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

    static async init() {
        this.initExpress();
        this.initRoutes();

        try {
            await this.listenExpress();
        } catch (error) {
            log.error(error);
            process.exit(1);
            return;
        }

        log.info('Application is initialized and ready for use');
    }
}

global.App = App;
App.init();