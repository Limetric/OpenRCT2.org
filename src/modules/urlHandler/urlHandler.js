import {got} from 'got';
import {promisify} from 'node:util';
import stream from 'node:stream';
import Crypto from 'node:crypto';

export class UrlHandler {
  /**
   * Get hash from URL
   *
   * @param {string} url URL
   * @returns {Promise<string>} Hash
   */
  static async getHash(url) {
    const hash = Crypto.createHash('sha256');
    hash.setEncoding('hex');

    const pipeline = promisify(stream.pipeline);

    await pipeline(
      got.stream(url),
      hash,
    );

    return hash.read();
  }
}
