class ChangelogScraper {
    /**
     *
     * @returns {Promise<void>}
     */
    static async run() {
        setTimeout(() => {
            this.run();
        }, 3600 * 1000);

        let saved;
        try {
            const rawContent = await this.getFile();
            const content = this.parse(rawContent);
            saved = await this.save(this.getFilename(), content);
        } catch (error) {
            log.error(error);
            return;
        }

        log.debug(saved ? 'Saved new changelog' : 'Parsed latest changelog but didn\'t save');
    }

    /**
     *
     * @returns {Promise<string>}
     */
    static getFile() {
        return new Promise(async (resolve, reject) => {
            const remoteUrl = 'https://raw.githubusercontent.com/OpenRCT2/OpenRCT2/develop/distribution/changelog.txt';

            const options = {
                uri: remoteUrl,
                qs: {}
            };

            let results;
            try {
                const rp = require('request-promise');
                results = await rp(options);
            } catch (error) {
                reject(error);
                return;
            }

            resolve(results);
        });
    }

    /**
     *
     * @param {string} rawContentStr
     */
    static parse(rawContentStr) {
        const rawContent = rawContentStr.split('\n');

        //Filter versions
        const changelog = [];

        let processingVersion;

        rawContent.forEach((str, index) => {
            if (!str.startsWith('------')) {
                if (!processingVersion)
                    return;

                //Skip malformed changes
                str = str.trim();
                if (!str || !str.startsWith('- '))
                    return;

                //Push change
                processingVersion.changes.push(str.substring(2));

                return;
            }

            const versionName = rawContent[index - 1];
            if (!versionName)
                return;

            processingVersion = {
                versionName,
                changes: []
            };
            changelog.push(processingVersion);
        });

        return changelog;
    }

    /**
     * Writes file if content is new
     * @param {string} file
     * @param {object} obj
     * @returns {Promise<boolean>}
     */
    static save(file, obj) {
        return new Promise((resolve, reject) => {
            const jsonfile = require('jsonfile');

            //Check if we already have the same content stored
            jsonfile.readFile(file, (error, readObj) => {
                if (!error && JSON.stringify(obj) === JSON.stringify(readObj)) {
                    resolve(false);
                    return;
                }

                //Write new file
                jsonfile.writeFile(file, obj, error => {
                    if (error)
                        reject(error);
                    else
                        resolve(true);
                });
            });
        });
    }

    /**
     *
     * @returns {string}
     */
    static getFilename() {
        const path = require('path');
        return path.join(App.paths.data, 'changelog.json');
    }
}

module.exports = ChangelogScraper;