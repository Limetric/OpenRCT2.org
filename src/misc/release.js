import rpn from 'request-promise-native';
import Database from './database';

class Asset {
  /**
   * @type {Release}
   */
  #parentRelease;

  constructor(parentRelease) {
    this.#parentRelease = parentRelease;
  }

  /**
   * @type {number}
   */
  #id;

  /**
   * @type {string}
   */
  #fileName;

  /**
   * @type {string}
   */
  #url;

  /**
   * @type {string}
   */
  #platform;

  /**
   * @type {string}
   */
  #category;

  /**
   * @type {string}
   */
  #architecture;

  /**
   * @type {number}
   */
  #fileSize;

  /**
   * @type {string}
   */
  #title;

  /**
   * @type {string}
   */
  #fileHash;

  /**
   * Get GitHub asset ID
   *
   * @returns {number} Asset id
   */
  get id() {
    return this.#id;
  }

  /**
   * Set GitHub asset ID
   *
   * @param {number} value Asset id
   */
  set id(value) {
    this.#id = value;
  }

  /**
   * Get file name
   *
   * @returns {string} File name
   */
  get fileName() {
    return this.#fileName;
  }

  /**
   * Set file name
   *
   * @param {string} fileName File name
   */
  set fileName(fileName) {
    this.#fileName = fileName;

    // Determine platform
    if (this.fileName.includes('-windows')) {
      this.platform = 'Windows';
    } else if (this.fileName.includes('-macos')) {
      this.platform = 'macOS';
    } else if (this.fileName.includes('-android')) {
      this.platform = 'Android';
    } else if (this.fileName.includes('-jammy')) {
      this.platform = 'Ubuntu Jammy 22.04';
      this.category = 'linux'; // Force category
    } else if (this.fileName.includes('-focal')) {
      this.platform = 'Ubuntu Focal 20.04';
      this.category = 'linux'; // Force category
    } else if (this.fileName.includes('-bionic') || this.fileName.includes('-linux')) {
      this.platform = 'Ubuntu Bionic 18.04';
      this.category = 'linux'; // Force category
    } else if (this.fileName.includes('-bullseye')) {
      this.platform = 'Debian Bullseye';
      this.category = 'linux'; // Force category
    } else {
      this.platform = 'misc';
    }

    // Determine category if not defined
    if (!this.category) {
      if (this.isDebugSymbols) {
        // Force miscellaneous category for debug symbols
        this.category = 'misc';
      } else {
        this.category = this.platform.toLowerCase();
      }
    }

    // Determine architecture
    if (this.fileName.includes('-x64') || this.fileName.includes('-win64')) {
      this.architecture = 'x64';
    } else if (this.fileName.includes('-x86_64')) {
      this.architecture = 'x86_64';
    } else if (this.fileName.includes('-x86') || this.fileName.includes('-win32')) {
      this.architecture = 'x86';
    } else if (this.fileName.includes('-i686')) {
      this.architecture = 'i686';
    } else if (this.fileName.includes('-arm64')) {
      this.architecture = 'ARM64';
    } else if (this.platform === 'macOS') {
      this.architecture = 'Universal';
    }

    // Determine title
    if (this.isInstaller) {
      this.title = 'Installer';
    } else if (this.isPortableZIP) {
      this.title = 'Portable';
    } else if (this.isDebugSymbols) {
      this.title = 'Debug Symbols';
    }
  }

  /**
   * Get GitHub download URL
   *
   * @returns {string} Download URL
   */
  get url() {
    return this.#url;
  }

  /**
   * Get GitHub redirect-less URL
   *
   * @returns {Promise<string>} Redirect-less URL
   */
  async getRedirlessUrl() {
    if (!this.url) {
      return undefined;
    }

    const response = await rpn({
      url: this.url,
      followRedirect: false,
      resolveWithFullResponse: true,
      simple: false,
      headers: {
        'User-Agent': 'OpenRCT2.org',
      },
    });

    return response.headers.location;
  }

  /**
   * Set GitHub download URL
   *
   * @param {string} value Download URL
   */
  set url(value) {
    this.#url = value;
  }

  /**
   * Get category
   *
   * @returns {string} Category
   */
  get category() {
    return this.#category;
  }

  /**
   * Set category
   *
   * @param {string} category Category
   */
  set category(category) {
    this.#category = category;
  }

  /**
   * Get platform
   *
   * @returns {string} Platform
   */
  get platform() {
    return this.#platform;
  }

  /**
   * Set platform
   *
   * @param {string} platform Platform
   */
  set platform(platform) {
    this.#platform = platform;
  }

  /**
   * Get architecture
   *
   * @returns {string} Architecture
   */
  get architecture() {
    return this.#architecture;
  }

  /**
   * Set architecture
   *
   * @param {string} architecture Architecture
   */
  set architecture(architecture) {
    this.#architecture = architecture;
  }

  /**
   * Get title
   *
   * @returns {string} Title
   */
  get title() {
    return this.#title;
  }

  /**
   * Is installer
   *
   * @returns {boolean} Is installer
   */
  get isInstaller() {
    return this.fileName.includes('-installer') || this.fileName.includes('.exe');
  }

  /**
   * Is debug symbols file
   *
   * @returns {boolean} Is debug symbols file
   */
  get isDebugSymbols() {
    if (!this.fileName) {
      return false;
    }

    return this.fileName.includes('-symbols') || this.fileName.includes('-debugsymbols');
  }

  /**
   * Is portable ZIP file
   *
   * @returns {boolean} Is portable ZIP file
   */
  get isPortableZIP() {
    if (!this.fileName) {
      return false;
    }

    return this.fileName.includes('-portable') || (this.fileName.includes('.zip') && !this.isDebugSymbols);
  }

  /**
   * Get flavour id
   *
   * @deprecated
   * @returns {number} Flavour id
   */
  get flavourId() {
    const category = this.category.toLowerCase();
    const {architecture} = this;

    if (category === 'windows') {
      if (architecture === 'x64') {
        if (this.isPortableZIP) {
          return 6;
        }

        return this.isInstaller ? 7 : 10;
      }

      if (this.isPortableZIP) {
        return 1;
      }

      return this.isInstaller ? 2 : 5;
    }
    if (category === 'macos') {
      return 3;
    }
    if (category === 'linux') {
      return architecture === 'x86_64' || architecture === 'x64' ? 9 : 4;
    }
    if (category === 'android') {
      if (architecture === 'arm') {
        return 11;
      }

      return architecture === 'x86' ? 12 : 0;
    }

    return 0;
  }

  /**
   * Set title
   *
   * @param {string} title Title
   */
  set title(title) {
    this.#title = title;
  }

  /**
   * Get file size
   *
   * @returns {number} File size
   */
  get fileSize() {
    return this.#fileSize;
  }

  /**
   * Set file size
   *
   * @param {number} fileSize File size
   */
  set fileSize(fileSize) {
    this.#fileSize = fileSize;
  }

  /**
   * Get file SHA-256 hash sum
   *
   * @returns {string} File hash
   */
  get fileHash() {
    return this.#fileHash;
  }

  /**
   * Set file SHA-256 hash sum
   *
   * @param {string} fileHash File hash
   */
  set fileHash(fileHash) {
    this.#fileHash = fileHash;
  }
}

export default class Release {
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
   * @type {Set<Asset>}
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
   * Get commit short
   *
   * @returns {string} Commit short
   */
  get commitShort() {
    return this.#commit?.substr(0, 7);
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
   * @returns {Set<Asset>} Assets
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
    const assetRecords = await Database.instance.query('SELECT * FROM `releaseAssets` WHERE `releaseId` = ?', [this.id]);

    this.assets.clear();
    for (const assetRecord of assetRecords) {
      const asset = new Asset();
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
   * @returns {Set<Asset>} Assets
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
   * @returns {Set<Asset>} Assets
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
   * @returns {Asset} Assets
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
