import RPN from 'request-promise-native';
import log from '../../utils/log';
import Paths from '../../utils/paths';
import Path from 'path';
import JSONFile from 'jsonfile';
import Release from '../../misc/release';

export default class Releases {
    /**
     * Fetch GitHub API
     * @param {boolean} [forceParse=false]
     * @returns {void}
     */
    static async fetch(forceParse) {
        //Schedule next fetch
        setTimeout(this.fetch.bind(this), 3600 * 1000);

        let saved;
        try {
            const jsonData = await this.jsonData;
            saved = await this.save(this.filePath, jsonData);
            if (saved || forceParse)
                this.#releases = await this.parse(jsonData);
        } catch (error) {
            log.error(error);
            return;
        }

        if (saved)
            log.debug('Saved new releases data');
    }//

    /**
     * Get json data
     * @returns {Promise<string>}
     */
    static get jsonData() {
        return new Promise(async (resolve, reject) => {
            const options = {
                uri: 'https://api.github.com/repos/OpenRCT2/OpenRCT2/releases',
                qs: {},
                json: true,
                headers: {
                    'User-Agent': 'OpenRCT2.org'
                }
            };

            let results;
            try {
                results = await RPN(options);
            } catch (error) {
                reject(error);
                return;
            }

            resolve(results);
        });
    }

    /**
     * Parse content to releases
     * @param {Object} jsonData
     * @returns {Release[]} releases
     */
    static parse(jsonData) {
        const releases = [];

        for (const jsonReleaseData of jsonData) {
            //Skip drafts
            if (jsonReleaseData['draft'])
                continue;

            const release = new Release();
            release.parseGitHubAPIReleaseData(jsonReleaseData);
            releases.push(release);
        }

        return releases;
    }

    /**
     * Writes file if content is new
     * @param {string} file
     * @param {object} content
     * @returns {Promise<boolean>}
     */
    static save(file, content) {
        return new Promise((resolve, reject) => {
            //Check if we already have the same content stored
            JSONFile.readFile(file, (error, readContent) => {
                if (!error && JSON.stringify(content) === JSON.stringify(readContent)) {
                    resolve(false);
                    return;
                }

                //Write new file
                JSONFile.writeFile(file, content, error => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(true);
                });
            });
        });
    }

    /**
     * Get file path
     * @returns {string}
     */
    static get filePath() {
        return Path.join(Paths.data, 'releases.json');
    }

    /**
     * @type {Release[]}
     */
    static #releases = [];

    /**
     *
     * @returns {Release[]}
     */
    static get releases() {
        return this.#releases;
    }
//
    /**
     * Get last release
     * @returns {Release}
     */
    static get last() {
        const releases = this.releases;
        //ToDo: Sort by published date
        return releases.length >= 1 ? releases[0] : undefined;
    }

    /**
     * Get last release by branch
     * @param branch
     */
    static getLastByBranch(branch) {
        for (const release of this.releases) {
            log.debug(release.branch, branch);
            if (release.branch === branch)
                return release;
        }
    }

    /**
     * Get release by branch and version
     * @param {string} branch
     * @param {string} version
     * @returns {Release}
     */
    static getByBranchVersion(branch, version) {
        for (const release of this.releases) {
            if (release.version === version && release.branch === branch)
                return release;
        }

        return undefined;
    }

    /**
     * Get release by version
     * @param {string} version
     * @returns {Release}
     */
    static getByVersion(version) {
        for (const release of this.releases) {
            if (release.version === version)
                return release;
        }

        return undefined;
    }
}

Releases.fetch(true);