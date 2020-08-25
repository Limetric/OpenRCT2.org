import fs from 'fs';
import path from 'path';
import lodash from 'lodash/object';

export default class Config {
  /**
   * @type {Map<string, object>}
   */
  static #map = new Map();

  /**
   * Get dynamic routes configuration
   *
   * @param {string} type Type
   * @returns {object} Config
   */
  static get(type) {
    const config = this.#map.get(type) ?? this.#load(type);
    if (typeof (config) !== 'object') {
      throw new Error(`Unable to load config '${type}'`);
    }
    return config;
  }

  /**
   * Get environment
   *
   * @returns {string} Environment
   */
  static get environment() {
    return process.env.NODE_ENV ?? 'development';
  }

  /**
   * Get development environment state
   *
   * @returns {boolean} Is development environment
   */
  static get development() {
    return this.environment === 'development';
  }

  /**
   * Load config type
   *
   * @param {string} type Type
   * @returns {object} Config
   */
  static #load(type) {
    const baseConfigFilePath = path.join(__dirname, `../../config/${type}.json`);
    if (!fs.existsSync(baseConfigFilePath)) {
      console.error(new Error(`Required config file '${baseConfigFilePath}' is not available`));
      return undefined;
    }

    const config = require(baseConfigFilePath);

    // Private config
    const privateConfigFilePath = path.join(__dirname, `../../config/${type}.private.json`);
    if (fs.existsSync(privateConfigFilePath)) { lodash.merge(config, require(privateConfigFilePath)); }

    // Environment config
    const envConfigFilePath = path.join(__dirname, `../../config/${type}.${this.environment}.json`);
    if (fs.existsSync(envConfigFilePath)) { lodash.merge(config, require(envConfigFilePath)); }

    // Private environment config
    const privateEnvConfigFilePath = path.join(__dirname, `../../config/${type}.${this.environment}.private.json`);
    if (fs.existsSync(privateEnvConfigFilePath)) { lodash.merge(config, require(privateEnvConfigFilePath)); }

    this.#map.set(type, config);
    return config;
  }
}
