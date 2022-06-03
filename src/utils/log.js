import {init as initSentry, addBreadcrumb, captureException} from '@sentry/node';
import {format} from 'node:util';
import chalk from 'chalk';
import {hostname} from 'node:os';
import {Config} from '../misc/config.js';
import {VersionUtils} from './version.js';

const {dsn} = Config.get('sentry');
let sentryActive = false;
if (!Config.development && dsn) {
  initSentry({
    dsn,
    release: VersionUtils.getVersion(),
    environment: Config.environment,
    serverName: hostname(),
  });
  sentryActive = true;
}

const logLevelColors = {
  debug: chalk.white,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
  fatal: chalk.red.bold,
};

const Log = {
  debug: (...args) => {
    const formattedMessage = format(...args);
    if (Config.development) {
      console.debug(logLevelColors.debug('[DEBUG]'), formattedMessage);
    } else if (sentryActive) {
      addBreadcrumb({
        category: 'debug',
        message: formattedMessage,
        level: 'debug',
      });
    }
  },
  info: (...args) => {
    console.debug(logLevelColors.info('[INFO]'), format(...args));
  },
  warn: (...args) => {
    if (sentryActive) {
      captureException(...args);
    }

    console.warn(logLevelColors.warn('[WARN]'), format(...args));
  },
  error: (...args) => {
    if (sentryActive) {
      captureException(...args);
    }

    console.warn(logLevelColors.error('[ERROR]'), format(...args));
  },
  fatal: (...args) => {
    if (sentryActive) {
      captureException(...args);
    }

    console.warn(logLevelColors.fatal('[FATAL]'), format(...args));
  },
};

// Display detailed info about Unhandled Promise rejections and Uncaught Exceptions
process.on('unhandledRejection', (reason) => {
  if (!reason) {
    reason = new Error('Unhandled rejection');
  }

  Log.fatal(reason);
  process.exit(1);
});
process.on('uncaughtException', (error) => {
  Log.fatal(error);
  process.exit(1);
});

export {Log};
