import mysql, {Pool} from 'mysql2';
import {Config} from './config.js';
import {Log} from '../utils/log.js';

/**
 * Database class
 */
export class Database {
  /**
   * @type {Pool}
   */
  static #pool;

  /**
   * Get connection pool
   *
   * @returns {Pool} Connection pool
   */
  static get pool() {
    return this.#pool;
  }

  static {
    const {
      timezone,
      database,
      host,
      user,
      password,
      connectionLimit,
      socketPath,
    } = Config.get('database');

    this.#pool = mysql.createPool({
      host,
      user,
      password,
      database,
      connectionLimit,
      socketPath,
      charset: 'utf8mb4',
      timezone: typeof (timezone) === 'string' ? timezone : 'local',
      typeCast: (field, next) => {
        if (['TINY', 'BIT'].includes(field.type)) {
          // Cast `TINY` and `BIT` types with 1 length to boolean
          if (field.length === 1) {
            return field.string() === '1';
          }
        } else if (field.type === 'JSON') {
          // Cast `JSON` types
          // Note: Directly calling field.string() has encoding issues (issue #90)
          const value = field.buffer().toString();
          if (!value) {
            return undefined;
          }

          try {
            return JSON.parse(value);
          } catch (error) {
            Log.warn(error);
            return undefined;
          }
        }

        const n = next();
        return n !== null ? n : undefined;
      },
      queueLimit: 100,
    }).promise();

    Log.debug(`Created database pool using database: ${database}`);
  }

  /**
   * Escape a variable
   *
   * @param {*} value Value
   * @returns {*} Escaped value
   */
  static escape(value) {
    return this.pool.escape(value);
  }

  /**
   * Escape an id
   *
   * @param {string} value Id
   * @returns {string} Escaped id
   */
  static escapeId(value) {
    return this.pool.escapeId(value);
  }

  /**
   * Format SQL and replacement values into a SQL string.
   *
   * @param {string} sqlStatement The SQL for the query
   * @param {Array} [values] Any values to insert into placeholders in sql
   * @returns {string} Formatted SQL string
   */
  static format(sqlStatement, values) {
    return this.pool.format(sqlStatement, values);
  }

  /**
   * Wrap raw SQL strings from escape overriding
   *
   * @param {string} sql The raw SQL
   * @returns {object} Wrapped object
   */
  // Please note that the function does exist
  static raw = mysql.raw;

  /**
   * Run SQL query with optional defined values
   *
   * @param {string} sqlStatement SQL statement
   * @param {object|Array} [values] Values to add to SQL statement
   * @returns {Promise<Array>} Query result
   */
  static async query(sqlStatement, values) {
    const [rows] = await this.pool.query(sqlStatement, values);
    return rows ?? [];
  }

  /**
   * Escapes and formats where clause object to string
   *
   * @param {object} obj Object
   * @param {string} joinType Join type (either 'or' or 'and')
   * @returns {string} Formatted where clause to use in SQL statement
   */
  static formatWhereClause(obj, joinType) {
    if (!['or', 'and'].includes(joinType)) {
      throw new Error('Invalid join type');
    }

    const arr = [];
    for (const [key, value] of Object.entries(obj)) {
      arr.push(`${this.escapeId(key)} = ${this.escape(value)}`);
    }

    return arr.join(` ${joinType.toUpperCase()} `);
  }
}
