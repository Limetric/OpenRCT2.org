// eslint-disable-next-line import/no-unresolved
import {got} from 'got';
import hash from 'object-hash';
import {Database} from '../../misc/database.js';
import log from '../../utils/log.js';

export default class ChangelogParser {
  /**
   * Check for changelog updates
   *
   * @returns {void}
   */
  static async checkUpdate() {
    // Schedule next fetch
    setTimeout(this.checkUpdate.bind(this), 3600 * 1000);

    const changes = await this.parse(await got('https://raw.githubusercontent.com/OpenRCT2/OpenRCT2/develop/distribution/changelog.txt').text());
    if (changes > 0) {
      log.info(`Updated ${changes} changesets`);
    } else {
      log.debug('No changesets update');
    }
  }

  /**
   * Parse changelog raw content
   *
   * @param {string} rawContentStr Raw content
   * @returns {Promise<number>} Changes count
   */
  static async parse(rawContentStr) {
    const rawContent = rawContentStr.split('\n');

    // Filter versions
    const changesets = [];

    let processingChangeset;

    rawContent.forEach((str, index) => {
      if (!str.startsWith('------')) {
        if (!processingChangeset) {
          return;
        }

        // Skip malformed changes
        str = str.trim();
        if (!str || !str.startsWith('- ')) {
          return;
        }

        // Push change
        processingChangeset.changes.push(str.substring(2));

        return;
      }

      const versionName = rawContent[index - 1];
      if (!versionName) {
        return;
      }

      processingChangeset = {
        versionName,
        changes: [],
      };
      changesets.push(processingChangeset);
    });

    let changesCount = 0;

    for (const changeset of changesets) {
      try {
        // Generate changes hash to compare against Firestore
        changeset.changesHash = hash(changeset.changes);

        const records = await Database.query('SELECT `changesHash` FROM `changesets` WHERE `versionName` = ? LIMIT 0,1', [changeset.versionName]);

        if (records.length) {
          const record = records[0];
          // Check if changes hash is the same
          if (record['changesHash'] === changeset.changesHash) { continue; }
        }

        const updateData = {
          changesHash: changeset.changesHash,
          changes: JSON.stringify(changeset.changes),
        };

        const insertData = {
          versionName: changeset.versionName,
          ...updateData,
        };

        await Database.query('INSERT INTO `changesets` SET ? ON DUPLICATE KEY UPDATE ?', [insertData, updateData]);

        changesCount++;
      } catch (error) {
        log.warn(error);
      }
    }

    return changesCount;
  }
}
