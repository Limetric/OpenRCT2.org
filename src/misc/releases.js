import Release from './release';
import Database from './database';
import log from '../utils/log';

export default class Releases {
  /**
   * Get last release by branch
   *
   * @param {string} branch Branch
   * @param {number} [limit=1] Limit
   * @returns {Promise<Release[]>} Releases
   */
  static async getLastByBranch(branch, limit = 1) {
    const records = await Database.instance.query('SELECT * FROM `releases` WHERE `branch` = ? ORDER BY `published` DESC LIMIT 0,?', [branch, limit]) ?? [];

    const releases = [];
    for (const record of records) {
      const release = new Release();
      try {
        await release.parseRecord(record);
      } catch (error) {
        log.warn(error);
        continue;
      }
      releases.push(release);
    }

    return releases;
  }

  /**
   * Get release by branch and version
   *
   * @param {string} branch Branch
   * @param {string} version Version
   * @returns {Promise<Release>} Release
   */
  static async getByBranchVersion(branch, version) {
    const record = (await Database.instance.query('SELECT * FROM `releases` WHERE `branch` = ? AND `version` = ? LIMIT 0,1', [branch, version]))?.[0];
    if (!record) {
      return undefined;
    }

    const release = new Release();
    await release.parseRecord(record);
    return release;
  }
}
