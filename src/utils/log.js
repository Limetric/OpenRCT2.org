import Bunyan from 'bunyan';

const appName = require('../../package').name;

const log = Bunyan.createLogger({
    name: appName,
    src: false,
    streams: []
});

if (process.env.NODE_ENV === 'production') {
    log.addStream({
        level: 'warn',
        stream: process.stderr,
    });
    log.addStream({
        level: 'info',
        stream: process.stdout
    });
} else {
    log.addStream({
        level: 'trace',
        stream: process.stdout
    });
    log.addStream({
        type: 'rotating-file',
        path: 'logs/info.log',
        level: 'info',
        period: '1d',
        count: 5
    });
    log.addStream({
        type: 'rotating-file',
        path: 'logs/error.log',
        level: 'warn',
        period: '1d',
        count: 5
    });
    log.addStream({
        type: 'rotating-file',
        path: 'logs/fatal.log',
        level: 'fatal',
        period: '1d',
        count: 5
    });
}

//Log detailed info about unhandled Promise rejections and uncaught Exceptions
process.on('unhandledRejection', (reason, p) => log.fatal('Unhandled Rejection at:', p, 'reason:', reason));
process.on('uncaughtException', error => log.fatal('Uncaught Exception:', error));

export default log;