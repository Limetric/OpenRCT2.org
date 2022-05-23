import {readdirSync} from 'node:fs';
import merge from 'lodash/merge.js';
import jsonfile from 'jsonfile';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {Map<string, object>} */
const configFiles = new Map();

// Load all config files in a blocking state as other files directly depend on it
const directory = join(__dirname, '../../config/');
for (const file of readdirSync(directory)) {
  if (!file.endsWith('.json')) {
    continue;
  }

  configFiles.set(file, jsonfile.readFileSync(join(directory, file)));
}

export class Config {
  /**
   * @type {Map<string, object>}
   */
  static #map = new Map();

  /**
   * Get dynamic routes configuration
   *
   * @param {string} type Type
   * @returns {object} Config data
   */
  static get(type) {
    return this.#map.get(type) ?? this.#load(type);
  }

  /**
   * Get environment
   *
   * @returns {string} Environment
   */
  static get environment() {
    return process.env['NODE_ENV'];
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
   * @returns {object} Config data
   */
  static #load(type) {
    const baseConfigFilePath = `${type}.json`;
    if (!configFiles.has(baseConfigFilePath)) {
      throw new Error(`Required config file '${baseConfigFilePath}' is not available`);
    }

    const config = configFiles.get(baseConfigFilePath);

    // Private config
    const privateConfigFilePath = `${type}.private.json`;
    if (configFiles.has(privateConfigFilePath)) {
      merge(config, configFiles.get(privateConfigFilePath));
    }

    // Environment config
    const envConfigFilePath = `${type}.${this.environment}.json`;
    if (configFiles.has(envConfigFilePath)) {
      merge(config, configFiles.get(envConfigFilePath));
    }

    // Private environment config
    const privateEnvConfigFilePath = `${type}.${this.environment}.private.json`;
    if (configFiles.has(privateEnvConfigFilePath)) {
      merge(config, configFiles.get(privateEnvConfigFilePath));
    }

    this.#map.set(type, config);
    return config;
  }
}
