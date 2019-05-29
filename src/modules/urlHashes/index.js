import Request from 'request';
import log from '../../utils/log';
import Paths from '../../utils/paths';
import Path from 'path';
import JSONFile from 'jsonfile';
import Crypto from 'crypto';
import FS from 'fs';

/**
 * Convert Map to object
 * @param {Map<string, string>} map
 * @returns {object}
 */
const mapToObject = map => {
    const obj = {};
    for (const [item, value] of map.entries())
        obj[item] = value;
    return obj;
};

export default class UrlHashes {
    /**
     * @type {Map<string, string>}
     */
    static #hashes = new Map();

    /**
     * Get hash from url
     * @param {string} url
     * @returns {Promise<string>}
     */
    static getHash(url) {
        return new Promise(async (resolve, reject) => {
            let hashSum = this.#hashes.get(url);
            if (hashSum) {
                resolve(hashSum);
                return;
            }

            const hash = Crypto.createHash('sha256');
            hash.setEncoding('hex');

            Request.get(url)
                .on('error', (error) => {
                    reject(error);
                }).on('end', () => {
                hash.end();

                const hashSum = hash.read();

                this.#hashes.set(url, hashSum);

                this.save();

                resolve(hashSum);
            }).pipe(hash);
        });
    }

    /**
     * Async loads hashes file
     */
    static load() {
        const fileName = this.fileName;
        if (FS.existsSync(fileName)) {
            JSONFile.readFile(fileName, (error, content) => {
                if (error) {
                    log.error(error);
                    return;
                }

                for (const [url, hash] of Object.entries(content))
                    this.#hashes.set(url, hash);
            });
        }
    }

    /**
     * Async writes hashes file
     */
    static save() {
        log.info('Saving ', this.#hashes.size);
        JSONFile.writeFile(this.fileName, mapToObject(this.#hashes), error => {
            if (error)
                log.error(error);
        });
    }

    /**
     * Get file name
     * @returns {string}
     */
    static get fileName() {
        return Path.join(Paths.data, 'fileHashes.json');
    }
}

UrlHashes.load();