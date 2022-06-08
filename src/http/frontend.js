import jsonfile from 'jsonfile';

export class FrontendManager {
  /**
   * Entry points
   *
   * @type {object}
   */
  static #entryPoints;

  /**
   * Entry points
   *
   * @returns {Promise<object>} Entry points
   */
  static async getEntryPoints() {
    if (!this.#entryPoints) {
      await this.#loadFrontendManifest();
    }

    return this.#entryPoints;
  }

  /**
   * Generate paths to frontend bundles
   *
   * @returns {Promise<void>}
   */
  static async #loadFrontendManifest() {
    const entryPoints = (await jsonfile.readFile('./public/resources/assets-manifest.json'))?.entrypoints;
    if (!entryPoints) {
      throw new Error('Unable to find entry points');
    }

    this.#entryPoints = entryPoints;
  }
}
