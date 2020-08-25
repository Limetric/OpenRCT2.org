import log from '../utils/log';

export default class SingletonClass {
  /**
   * @type {SingletonClass}
   */
  static _instance;

  /**
   * Get or creates default instance of class
   *
   * @returns {*} instance
   */
  static get instance() {
    if (!this._instance) {
      this._instance = new this();
    }

    return this._instance;
  }

  /**
   * Get default instance of class if available
   *
   * @returns {*|undefined} Optional instance
   */
  static get optionalInstance() {
    return this._instance;
  }

  /**
   * Destroy default instance of class
   */
  static destroy() {
    if (this._instance) {
      this._instance.destroy();
    }
  }

  /**
   * Destroy instance
   */
  destroy() {
    if (this.constructor._instance !== this) {
      log.warn(new Error('Tried to destroy invalid singleton instance'));
      return;
    }

    this.constructor._instance = undefined;
  }
}
