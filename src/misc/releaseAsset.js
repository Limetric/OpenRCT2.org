import {got} from 'got';

/**
 * @typedef {import('./release.js').Release} Release
 */

export class ReleaseAsset {
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

    const lcFileName = fileName.toLowerCase();

    // Determine platform
    if (lcFileName.includes('-windows')) {
      this.platform = 'Windows';
    } else if (lcFileName.includes('-macos')) {
      this.platform = 'macOS';
    } else if (lcFileName.includes('-android')) {
      this.platform = 'Android';
    } else if (lcFileName.includes('-noble')) {
      this.platform = 'Ubuntu Noble 24.04';
      this.category = 'linux'; // Force category
    } else if (lcFileName.includes('-jammy')) {
      this.platform = 'Ubuntu Jammy 22.04';
      this.category = 'linux'; // Force category
    } else if (lcFileName.includes('-focal')) {
      this.platform = 'Ubuntu Focal 20.04';
      this.category = 'linux'; // Force category
    } else if (lcFileName.includes('-bionic')) {
      this.platform = 'Ubuntu Bionic 18.04';
      this.category = 'linux'; // Force category
    } else if (lcFileName.includes('-bookworm')) {
      this.platform = 'Debian Bookworm';
      this.category = 'linux'; // Force category
    } else if (lcFileName.includes('-bullseye')) {
      this.platform = 'Debian Bullseye';
      this.category = 'linux'; // Force category
    } else if (lcFileName.endsWith('.AppImage')) {
      this.platform = 'AppImage';
      this.category = 'linux'; // Force category
    } else if (lcFileName.includes('-linux')) {
      this.platform = 'Linux';
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
    if (lcFileName.includes('-x64') || lcFileName.includes('-win64')) {
      this.architecture = 'x64';
    } else if (lcFileName.includes('-x86_64')) {
      this.architecture = 'x86_64';
    } else if (lcFileName.includes('-x86') || lcFileName.includes('-win32')) {
      this.architecture = 'x86';
    } else if (lcFileName.includes('-i686')) {
      this.architecture = 'i686';
    } else if (lcFileName.includes('-arm64')) {
      this.architecture = 'ARM64';
    } else if (lcFileName.includes('-arm')) {
      this.architecture = 'ARM';
    } else if (lcFileName.includes('-universal')) {
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
   * Set GitHub download URL
   *
   * @param {string} url Download URL
   */
  set url(url) {
    this.#url = url;
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

    const {headers} = await got(this.url, {
      followRedirect: false,
    });

    return headers.location;
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
   * Set title
   *
   * @param {string} title Title
   */
  set title(title) {
    this.#title = title;
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
