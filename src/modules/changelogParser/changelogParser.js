import {got} from 'got';
import hash from 'object-hash';
import {Database} from '../../misc/database.js';
import {Log} from '../../utils/log.js';

export class ChangelogParser {
  /**
   * Check for changelog updates
   *
   * @returns {void}
   */
  static async checkUpdate() {
    // Schedule next fetch
    setTimeout(this.checkUpdate.bind(this), 3600 * 1000);

    const rawContent = await got('https://github.com/OpenRCT2/OpenRCT2/raw/develop/distribution/changelog.txt').text();

    const changes = await this.parse(rawContent);
    if (changes > 0) {
      Log.info(`Updated ${changes} changelog sets`);
    } else {
      Log.debug('No changelog update');
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

    /** @type {object} */
    let processingChangeset;

    for (const [index, str] of rawContent.entries()) {
      // Detect new changeset
      if (str.startsWith('------')) {
        const versionName = rawContent[index - 1];
        if (!versionName) {
          continue;
        }

        processingChangeset = {
          versionName,
          changes: [],
        };
        changesets.push(processingChangeset);
      } else {
        // Skip if no changeset is processed
        if (!processingChangeset) {
          continue;
        }

        // Skip malformed changes
        const trimmedStr = str.trim();
        if (!trimmedStr || !trimmedStr.startsWith('- ')) {
          continue;
        }

        // Push change
        processingChangeset.changes.push(trimmedStr.substring(2));

        continue;
      }
    }

    let changesCount = 0;

    for (const changeset of changesets) {
      try {
        // Generate changes hash to compare against Firestore
        changeset.changesHash = hash(changeset.changes);

        const record = (await Database.query('SELECT `changesHash` FROM `changesets` WHERE `versionName` = ? LIMIT 0,1', [changeset.versionName]))?.[0];

        // Check if changes hash is the same
        if (record?.['changesHash'] === changeset.changesHash) {
          continue;
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
        Log.warn(error);
      }
    }

    return changesCount;
  }
}
