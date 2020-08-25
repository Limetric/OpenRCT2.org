import Request from 'request';
import Crypto from 'crypto';

export default class UrlHandler {
  /**
   * Get hash from URL
   *
   * @param {string} url URL
   * @returns {Promise<string>} Hash
   */
  static getHash(url) {
    return new Promise((resolve, reject) => {
      const hash = Crypto.createHash('sha256');
      hash.setEncoding('hex');

      Request.get(url).on('error', (error) => {
        reject(error);
      }).on('end', () => {
        hash.end();
        const hashSum = hash.read();
        resolve(hashSum);
      }).pipe(hash);
    });
  }
}
