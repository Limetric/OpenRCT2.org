import {addBreadcrumb, captureException, withScope as sentryWithScope} from '@sentry/node';
import {format} from 'node:util';
import chalk from 'chalk';
import {Config} from '../misc/config.js';

const logLevelColors = {
  debug: chalk.white,
  info: chalk.blue,
  warn: chalk.yellow,
  error: chalk.red,
  fatal: chalk.red.bold,
};

export class Log {
  /**
   * Get time representation text for console use
   *
   * @returns {string} Time representation text
   */
  static #getTimeRepresentation() {
    return `[${new Date().toLocaleTimeString('en-GB')}]`;
  }

  /**
   * Log debug message to console and Sentry
   *
   * @param {...} args Arguments
   */
  static debug(...args) {
    const formattedMessage = format(...args);
    if (Config.development) {
      console.debug(this.#getTimeRepresentation(), logLevelColors.debug('[DEBUG]'), formattedMessage);
    }

    addBreadcrumb({
      category: 'debug',
      message: formattedMessage,
      level: 'debug',
    });
  }

  /**
   * Log info message to console and Sentry
   *
   * @param {...} args Arguments
   */
  static info(...args) {
    const formattedMessage = format(...args);

    console.log(this.#getTimeRepresentation(), logLevelColors.info('[INFO]'), formattedMessage);

    addBreadcrumb({
      category: 'info',
      message: formattedMessage,
      level: 'info',
    });
  }

  /**
   * Log warning error to console and Sentry
   *
   * @param {Error} error Error
   */
  static warn(error) {
    console.warn(this.#getTimeRepresentation(), logLevelColors.warn('[WARN]'), error);

    sentryWithScope((scope) => {
      scope.setLevel('warning');
      captureException(error, {
        tags: Object.fromEntries(Object.entries(error)),
      });
    });
  }

  /**
   * Log regular error to console and Sentry
   *
   * @param {Error} error Error
   */
  static error(error) {
    console.error(this.#getTimeRepresentation(), logLevelColors.error('[ERROR]'), error);

    sentryWithScope((scope) => {
      scope.setLevel('error');
      captureException(error, {
        tags: Object.fromEntries(Object.entries(error)),
      });
    });
  }

  /**
   * Log fatal error to console and Sentry
   *
   * @param {Error} error Error
   */
  static fatal(error) {
    console.error(this.#getTimeRepresentation(), logLevelColors.fatal('[FATAL]'), error);

    sentryWithScope((scope) => {
      scope.setLevel('fatal');
      captureException(error, {
        tags: Object.fromEntries(Object.entries(error)),
      });
    });
  }
}

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
