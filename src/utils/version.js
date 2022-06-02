import {env} from 'node:process';
import Package from '../../package.json' assert {type: 'json'};

export class VersionUtils {
  /** @type {string} */
  static #cachedVersion;

  static getVersion() {
    if (!this.#cachedVersion) {
      // Determine git tag and commit
      const gitTag = env['GIT_REF']?.startsWith('refs/tags/') ? env['GIT_REF'].substring(10) : undefined;
      const gitCommit = env['GIT_SHA'].substring(0, 7);

      // Determine version
      this.#cachedVersion = `${gitTag ?? `v${Package.version}-${gitCommit}`}`;
    }

    return this.#cachedVersion;
  }
}
