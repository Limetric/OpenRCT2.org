import Request from 'request';
import log from '../../utils/log';
import Crypto from 'crypto';

export default class UrlHandler {
    /**
     * Get hash from url
     * @param {string} url
     * @returns {Promise<string>}
     */
    static getHash(url) {
        return new Promise(async (resolve, reject) => {
            const hash = Crypto.createHash('sha256');
            hash.setEncoding('hex');

            Request.get(url)
                .on('error', (error) => {
                    reject(error);
                }).on('end', () => {
                hash.end();

                const hashSum = hash.read();

                resolve(hashSum);
            }).pipe(hash);
        });
    }
}