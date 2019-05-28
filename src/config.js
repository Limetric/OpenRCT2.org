import FS from 'fs';
import Path from 'path';
import log from './utils/log';

class Config {
    /**
     * @type {Map<string, Object>}
     */
    #map = new Map();

    /**
     * Get site configuration
     * @returns {Object}
     */
    get site() {
        return this.#map.get('site') || {};
    }

    /**
     * Get http configuration
     * @returns {Object}
     */
    get http() {
        return this.#map.get('http') || {};
    }

    constructor() {
        this.#load('site');
        this.#load('http');
    }

    /**
     * Get environment
     * @returns {string}
     */
    get environment() {
        return process.env.NODE_ENV;
    }

    /**
     * Get development environment state
     * @returns {boolean}
     */
    get development() {
        return process.env.NODE_ENV === 'development';
    }

    #load(type) {
        const baseConfigFilePath = Path.join(__dirname, `../config/${type}.json`);
        if (!FS.existsSync(baseConfigFilePath)) {
            log.error(new Error(`Required config file '${baseConfigFilePath}' is not available`));
            return;
        }

        const config = require(baseConfigFilePath);

        //Private config
        const privateConfigFilePath = Path.join(__dirname, `../../config/${type}.private.json`);
        if (FS.existsSync(privateConfigFilePath))
            Object.assign(config, require(privateConfigFilePath));

        //Environment config
        const envConfigFilePath = Path.join(__dirname, `../../config/${type}.${this.environment}.json`);
        if (FS.existsSync(envConfigFilePath))
            Object.assign(config, require(envConfigFilePath));

        //Private environment config
        const privateEnvConfigFilePath = Path.join(__dirname, `../../config/${type}.${this.environment}.private.json`);
        if (FS.existsSync(privateEnvConfigFilePath))
            Object.assign(config, require(privateEnvConfigFilePath));

        this.#map.set(type, config);
    }
}

export default new Config();
