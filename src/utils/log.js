import * as Sentry from '@sentry/node';
import { format } from 'util';
import chalk from 'chalk';
import { basename } from 'path';
import { hostname } from 'os';
import Config from '../misc/config';

const { dsn } = Config.get('sentry');
let sentryActive = false;
if (!Config.development && dsn) {
  const packageJson = require('../../package');
  Sentry.init({
    dsn,
    release: `v${packageJson.version}`,
    environment: Config.environment,
    serverName: `${basename(process.mainModule.filename).slice(0, -3)}@${hostname()}`,
  });
  sentryActive = true;
}

const logLevelColors = {
  debug: chalk.white,
  info: chalk.blue,
  warn: chalk.keyword('orange'),
  error: chalk.keyword('red'),
  fatal: chalk.keyword('red').bold,
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

export default Log;
