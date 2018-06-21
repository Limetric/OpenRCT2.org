#!/usr/bin/env node

console.log('#############################');
console.log('OpenRCT2.org');
console.log('#############################');

class App {
    static initLog() {
        const bunyan = require('bunyan');
        global.log = bunyan.createLogger({
            name: 'OpenRCT2.org',
            streams: [
                {
                    level: this.isDevelopment ? 'trace' : 'info',
                    stream: process.stdout
                },
                /*{
                    type: 'rotating-file',
                    path: 'logs/trace.log',
                    level: 'trace',
                    period: '1d',
                    count: 5
                },*/
                {
                    type: 'rotating-file',
                    path: 'logs/info.log',
                    level: 'info',
                    period: '1d',
                    count: 5
                },
                {
                    type: 'rotating-file',
                    path: 'logs/error.log',
                    level: 'warn',
                    period: '1d',
                    count: 5
                },
                {
                    type: 'rotating-file',
                    path: 'logs/fatal.log',
                    level: 'fatal',
                    period: '1d',
                    count: 5
                }
            ],
            src: false
            //src: this.isDevelopment
        });
    }

    static initConfig() {
        const _ = require('lodash');
        const module = './config/env.json';
        delete require.cache[require.resolve(module)];
        const env = require(module);

        if (typeof(env[this.env]) !== 'object') {
            log.warn('No custom environment config set!');
            this.config = env['base'];
        } else
            this.config = _.defaultsDeep(_.clone(env[this.env]), env['base']);

        if (!this.config.configReloadTimeSeconds)
            return log.warn('No config reload time set. Will not reload.');

        setTimeout(() => {
            log.debug('Reloading server configuration');
            this.initConfig();
        }, this.config.configReloadTimeSeconds * 1000);
    }

    static initDatabase() {
        return new Promise(async (resolve, reject) => {
            const dbConfig = this.config.database;
            const Database = require('./base/database');
            global.db = new Database(dbConfig.socket, dbConfig.host, dbConfig.port, dbConfig.user, dbConfig.password, dbConfig.databaseName, dbConfig.connectionLimit);
            try {
                await db.connect();
            } catch (error) {
                return reject(error);
            }

            resolve();
        });
    }

    static initExpress() {
        const Express = require('express');
        this.express = Express();
        this.express.set('x-powered-by', false);
        this.express.set('trust proxy', this.config.http.trustProxy ? 1 : 0);

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
            title: 'OpenRCT2.org',
            //description: ''
        };
        this.express.locals.author = {
            name: 'OpenRCT2.org',
            emailAddress: 'webmaster@openrct2.org'
        };
    }

    static listenExpress() {
        return new Promise((resolve, reject) => {
            this.server.listen(this.config.host.port, this.config.host.address);
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
        this.express.use('/resources', express.static(path.join(__dirname, 'public', 'resources'), {
            etag: !App.isDevelopment
        }));
        this.express.use('/assets', express.static(path.join(__dirname, 'public', 'assets'), {
            etag: !App.isDevelopment
        }));
        
        this.express.use('/', require('./routes/staticPages'));

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

            if (!error.message)
                error.message = 'An unknown error occurred.';

            res.status(error.status);
            const layout = require('./views/error.marko');
            res.marko(layout, {
                error,
                isDevelopment: this.isDevelopment,
                page: {
                    title: error.message,
                    description: 'An error occurred on platform.'
                }
            });
        });
    }

    static async init() {
        this.env = process.env.NODE_ENV;
        this.isDevelopment = process.env.NODE_ENV === 'development';

        this.initLog();
        this.initConfig();
        log.info(`Current environment: ${this.env} (debug: %s}`, this.isDevelopment);

        //Display detailed info about Unhandled Promise rejections and Uncaught Exceptions
        process.on('unhandledRejection', (reason, p) => log.fatal('Unhandled Rejection at:', p, 'reason:', reason));
        process.on('uncaughtException', error => log.fatal('Uncaught Exception:', error));

        try {
            await this.initDatabase();
        } catch (error) {
            log.error(error);
            process.exit(1);
            return;
        }

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

//Display detailed info about Unhandled Promise rejections and Uncaught Exceptions
process.on('unhandledRejection', (reason, p) => console.error('Unhandled Rejection at:', p, 'reason:', reason));
process.on('uncaughtException', error => console.error('Uncaught Exception:', error));

App.init();