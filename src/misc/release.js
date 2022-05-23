import {Database} from './database.js';
import {ReleaseAsset} from './releaseAsset.js';

export class Release {
  /**
   * @type {number}
   */
  #id;

  /**
   * @type {string}
   */
  #name;

  /**
   * @type {string}
   */
  #version;

  /**
   * @type {Date}
   */
  #created;

  /**
   * @type {Date}
   */
  #published;

  /**
   * @type {string}
   */
  #url;

  /**
   * @type {string}
   */
  #notes;

  /**
   * @type {string}
   */
  #branch;

  /**
   * @type {string}
   */
  #commit;

  /**
   * @type {Set<ReleaseAsset>}
   */
  #assets = new Set();

  /**
   * Get GitHub release ID
   *
   * @returns {number} Release id
   */
  get id() {
    return this.#id;
  }

  /**
   * Set GitHub release ID
   *
   * @param {number} value Release id
   */
  set id(value) {
    this.#id = value;
  }

  /**
   * Get name
   *
   * @returns {string} Name
   */
  get name() {
    if (!this.#name) {
      return this.version;
    }

    return this.#name;
  }

  /**
   * Set name
   *
   * @param {string} value Name
   */
  set name(value) {
    this.#name = value;
  }

  /**
   * Get version (tag name)
   *
   * @returns {string} Tag name
   */
  get version() {
    return this.#version;
  }

  /**
   * Set version (tag name)
   *
   * @param {string} value Tag name
   */
  set version(value) {
    this.#version = value;
  }

  /**
   * Get created date
   *
   * @returns {Date} Created date
   */
  get created() {
    return this.#created;
  }

  /**
   * Set created date
   *
   * @param {Date|string} value Created date
   */
  set created(value) {
    // Parse string date
    if (typeof (value) === 'string' && value) {
      value = new Date(value);
    }

    this.#created = value;
  }

  /**
   * Get published date
   *
   * @returns {Date} Published date
   */
  get published() {
    return this.#published;
  }

  /**
   * Set published date
   *
   * @param {Date|string} value Published date
   */
  set published(value) {
    // Parse string date
    if (typeof (value) === 'string' && value) {
      value = new Date(value);
    }

    this.#published = value;
  }

  /**
   * Get GitHub url
   *
   * @returns {string} URL
   */
  get url() {
    return this.#url;
  }

  /**
   * Set GitHub url
   *
   * @param {string} value URL
   */
  set url(value) {
    this.#url = value;
  }

  /**
   * Get notes
   *
   * @returns {string} Notes
   */
  get notes() {
    return this.#notes;
  }

  /**
   * Set notes
   *
   * @param {string} value Notes
   */
  set notes(value) {
    this.#notes = value;
  }

  /**
   * Get branch
   *
   * @returns {string} Branch
   */
  get branch() {
    return this.#branch;
  }

  /**
   * Set branch
   *
   * @param {string} branch Branch
   */
  set branch(branch) {
    this.#branch = branch;
  }

  /**
   * Get commit
   *
   * @returns {string} Commit hash
   */
  get commit() {
    return this.#commit;
  }

  /**
   * Set commit
   *
   * @param {string} value Commit hash
   */
  set commit(value) {
    this.#commit = value;
  }

  /**
   * Get commit short
   *
   * @returns {string} Commit short
   */
  get commitShort() {
    return this.#commit?.substr(0, 7);
  }

  /**
   * Get long release title
   *
   * @returns {string} Long release title
   */
  get longTitle() {
    const branch = this.branch === 'releases' ? 'release' : this.branch;

    return `${this.name} ${branch}`;
  }

  /**
   * Get short release title
   *
   * @returns {string} Short release title
   */
  get shortTitle() {
    const branch = this.branch === 'releases' ? 'release' : this.branch;

    return `${this.version} ${branch}`;
  }

  /**
   * Get assets
   *
   * @returns {Set<ReleaseAsset>} Assets
   */
  get assets() {
    return this.#assets;
  }

  /**
   * Parse database record
   *
   * @param {object} record Database record
   * @returns {Promise<void>}
   */
  async parseRecord(record) {
    this.#id = record['id'];
    this.#name = record['name'];
    this.#version = record['version'];
    this.#created = record['created'];
    this.#published = record['published'];
    this.#commit = record['commit'];
    this.#url = record['url'];
    this.#notes = record['notes'];
    this.#branch = record['branch'];

    // Parse assets
    const assetRecords = await Database.query('SELECT * FROM `releaseAssets` WHERE `releaseId` = ?', [this.id]);

    this.assets.clear();
    for (const assetRecord of assetRecords) {
      const asset = new ReleaseAsset();
      asset.id = assetRecord['id'];
      asset.url = assetRecord['url'];
      asset.fileSize = assetRecord['fileSize'];
      asset.fileHash = assetRecord['fileHash'];
      asset.fileName = assetRecord['fileName']; // Set as last
      this.assets.add(asset);
    }
  }

  /**
   * Get assets by platform
   *
   * @param {string} platform Platform
   * @returns {Set<ReleaseAsset>} Assets
   */
  getAssetsByPlatform(platform) {
    const output = new Set();
    for (const asset of this.assets) {
      if (asset.platform === platform) {
        output.add(asset);
      }
    }
    return output;
  }

  /**
   * Get assets by category
   *
   * @param {string} category Category
   * @returns {Set<ReleaseAsset>} Assets
   */
  getAssetsByCategory(category) {
    const output = new Set();
    for (const asset of this.assets) {
      if (asset.category === category) {
        output.add(asset);
      }
    }
    return output;
  }

  /**
   * Get asset by flavour id
   *
   * @deprecated
   * @param {number} flavourId Flavour id
   * @returns {ReleaseAsset} Assets
   */
  getAssetByFlavourId(flavourId) {
    for (const asset of this.assets) {
      if (asset.flavourId === flavourId) {
        return asset;
      }
    }
    return undefined;
  }
}
