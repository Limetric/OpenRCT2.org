import mysql, { Pool } from 'mysql';
import { promisify } from 'util';
import SingletonClass from './singletonClass';
import Config from './config';
import log from '../utils/log';

/**
 * Database class
 */
export default class Database extends SingletonClass {
  /**
   * Get or creates default instance of class
   *
   * @returns {Database} instance
   */
  static get instance() {
    /** @type {Database} */
    const instance = super.instance;

    if (!instance.pool) {
      const databaseConfig = Config.get('database');

      const { timezone, databaseName } = databaseConfig;

      instance.#pool = mysql.createPool({
        host: databaseConfig['host'],
        user: databaseConfig['user'],
        password: databaseConfig['password'],
        database: databaseName,
        connectionLimit: databaseConfig['connectionLimit'],
        socketPath: databaseConfig['socket'],
        debug: false,
        charset: 'utf8mb4',
        timezone: typeof (timezone) === 'string' ? timezone : 'local',
        typeCast: (field, next) => {
          if (field.type === 'TINY' && field.length === 1) {
            return field.string() === '1';
          } // 1 = true, 0 = false
          if (field.type === 'BIT' && field.length === 1) {
            return field.string() === '1';
          } // 1 = true, 0 = false
          if (field.type === 'JSON') {
            const value = field.string();
            if (!value) {
              return {};
            }

            try {
              return JSON.parse(value);
            } catch (error) {
              log.warn(error);
              return {};
            }
          } else {
            const n = next();
            return n !== null ? n : undefined;
          }
        },
      });

      log.debug(`Created database pool using database: ${databaseName}`);
    }

    return instance;
  }

  /**
   * @type {Pool}
   */
  #pool;

  /**
   * Get connection pool
   *
   * @returns {Pool} Connection pool
   */
  get pool() {
    return this.#pool;
  }

  /**
   * Escape a variable
   *
   * @param {*} value Value
   * @returns {*} Escaped value
   */
  escape(value) {
    return mysql.escape(value);
  }

  /**
   * Escape a column id
   *
   * @param {string} value Column id
   * @returns {string} Escaped column id
   */
  escapeId(value) {
    return mysql.escapeId(value);
  }

  /**
   * Format SQL and replacement values into a SQL string.
   *
   * @param {string} sql The SQL for the query
   * @param {Array} [values] Any values to insert into placeholders in sql
   * @param {boolean} [stringifyObjects=false] Setting if objects should be stringified
   * @param {string} [timeZone=local] Setting for time zone to use for Date conversion
   * @returns {string} Formatted SQL string
   */
  format(sql, values, stringifyObjects = false, timeZone = 'local') {
    return mysql.format(sql, values, stringifyObjects, timeZone);
  }

  /**
   * Wrap raw SQL strings from escape overriding
   *
   * @param {string} sql The raw SQL
   * @returns {object} Wrapped object
   */
  raw(sql) {
    return mysql.raw(sql);
  }

  /**
   * Query
   *
   * @param {string} sql SQL statement
   * @param {object | Array} [values] Values to insert in SQL statement
   * @returns {Promise<Array>} Records
   */
  async query(sql, values) {
    try {
      return await promisify(this.pool.query).bind(this.pool)(sql, values);
    } catch (error) {
      log.info(new Error(`Following query caused error: ${mysql.format(sql, values)}`));
      throw error;
    }
  }

  /**
   * Formats a SQL statement with defined inserts
   *
   * @param {string} sql SQL statement
   * @param {Array} inserts Values to insert in SQL statement
   * @returns {string} formattedSql Formatted SQL statement
   */
  static format(sql, inserts) {
    return mysql.format(sql, inserts);
  }
}
