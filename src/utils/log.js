import * as Sentry from '@sentry/node';
import {format} from 'node:util';
import chalk from 'chalk';
import {hostname} from 'node:os';
import {Config} from '../misc/config.js';
import Package from '../../package.json' assert { type: 'json' };

const {dsn} = Config.get('sentry');
let sentryActive = false;
if (!Config.development && dsn) {
  Sentry.init({
    dsn,
    release: `v${Package.version}`,
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
    } else {
      Sentry.addBreadcrumb({
        category: 'debug',
        message: formattedMessage,
        level: Sentry.Severity.Debug,
      });
    }
  },
  info: (...args) => {
    console.debug(logLevelColors.info('[INFO]'), format(...args));
  },
  warn: (...args) => {
    if (sentryActive) {
      Sentry.captureException(...args);
    }

    console.warn(logLevelColors.warn('[WARN]'), format(...args));
  },
  error: (...args) => {
    if (sentryActive) {
      Sentry.captureException(...args);
    }

    console.warn(logLevelColors.error('[ERROR]'), format(...args));
  },
  fatal: (...args) => {
    if (sentryActive) {
      Sentry.captureException(...args);
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
});
process.on('uncaughtException', (error) => Log.fatal(error));

export {Log};
