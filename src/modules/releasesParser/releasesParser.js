import {got} from 'got';
import {UrlHandler} from '../urlHandler/urlHandler.js';
import {StringUtils} from '../../utils/string.js';
import {Database} from '../../misc/database.js';

export class ReleasesParser {
  /**
   * Check for new releases
   *
   * @returns {void}
   */
  static async checkUpdate() {
    // Schedule next fetch
    setTimeout(this.checkUpdate.bind(this), 3600 * 1000);

    /**
     * @type {Map<string, string>}
     */
    const urls = new Map();
    urls.set('https://api.github.com/repos/OpenRCT2/OpenRCT2/releases', 'releases');
    urls.set('https://api.github.com/repos/OpenRCT2/OpenRCT2-binaries/releases/latest', 'develop');

    for (const [url, type] of urls) {
      const jsonData = await got(url).json();
      await this.parse(jsonData, type);
    }

    console.debug('Fetched releases');
  }

  /**
   * Parse content
   *
   * @param {object} jsonData JSON data
   * @param {string} type Type
   * @returns {Promise<void>}
   */
  static async parse(jsonData, type) {
    const parseRelease = async (jsonReleaseData) => {
      // Skip drafts
      if (jsonReleaseData['draft']) {
        return;
      }

      try {
        await this.parseReleaseData(jsonReleaseData, type);
      } catch (error) {
        console.warn(error);
      }
    };

    if (Array.isArray(jsonData)) {
      for (const jsonReleaseData of jsonData) {
        await parseRelease(jsonReleaseData);
      }
    } else {
      await parseRelease(jsonData);
    }
  }

  /**
   * Parse release data
   *
   * @param {*} data Data
   * @param {string} type Type
   * @returns {Promise<void>}
   */
  static async parseReleaseData(data, type) {
    let commit;
    let branch = type;
    let notes;

    // Get commit and branch from release body
    if (type === '*') {
      /**
       * @type {string}
       */
      const bodyStr = data['body'];
      if (typeof (bodyStr) !== 'string' || !bodyStr.includes(';')) {
        throw new Error('Invalid body');
      }

      const body = bodyStr.split(';');
      if (body.length !== 2) {
        throw new Error('Unexpected body length');
      }

      commit = StringUtils.substringBetween(body[0], '`', '`').toLowerCase();
      branch = StringUtils.substringBetween(body[1], '`', '`').toLowerCase();
    } else if (type === 'develop') {
      const {body} = data;
      const startIndex = body.indexOf('\n', body.indexOf('\n') + 1) + 1;
      const endIndex = body.indexOf('\n\n\nSHA1 checksums:');
      const extractedText = body.substring(startIndex, endIndex).trim();

      notes = extractedText;
    } else {
      notes = data['body'];
    }

    const records = await Database.query('SELECT * FROM `releases` WHERE `branch` = ? AND `id` = ? LIMIT 0,1', [branch, data['id']]);
    if (!records.length) {
      await Database.query('INSERT INTO `releases` SET ?', {
        id: data['id'],
        versionName: data['name'],
        version: data['tag_name'],
        created: data['created_at'] ? new Date(data['created_at']) : null,
        published: data['published_at'] ? new Date(data['published_at']) : null,
        url: data['html_url'],
        commit,
        notes,
        branch,
      });

      console.info(`Stored '${branch}-${data['id']}' in database`);
    }

    // Parse assets

    if (data['assets']) {
      for (const assetData of data['assets']) {
        try {
          const assetRecords = await Database.query('SELECT * FROM `releaseAssets` WHERE `id` = ? LIMIT 0,1', [assetData['id']]);

          if (!assetRecords.length) {
            const url = assetData['browser_download_url'];
            await Database.query('INSERT INTO `releaseAssets` SET ?', [{
              id: assetData['id'],
              releaseId: data['id'],
              url,
              fileSize: assetData['size'],
              fileName: assetData['name'],
              fileHash: await UrlHandler.getHash(url),
            }]);
          }
        } catch (error) {
          console.warn(error);
        }
      }
    } else {
      // Delete assets from database
      try {
        await Database.query('DELETE FROM `assets` WHERE `releaseId` = ?', [data['id']]);
      } catch (error) {
        console.warn(error);
      }
    }
  }
}
