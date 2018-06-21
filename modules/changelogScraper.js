class ChangelogScraper {
    static async run() {
        setTimeout(() => {
            this.run();
        }, 3600 * 1000);

        const path = require('path');
        const changelogFilename = path.join(App.paths.data, 'changelog.json');

        let contents;
        try {
            const rawContent = await this.getFile();
            contents = this.parse(rawContent);
            await this.save(changelogFilename, contents);
        } catch (error) {
            log.error(error);
            return;
        }

        log.debug('Saved new changelog');
    }

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

    static save(file, obj) {
        return new Promise((resolve, reject) => {
            const jsonfile = require('jsonfile');
            jsonfile.writeFile(file, obj, error => {
                if (error)
                    reject(error);
                else
                    resolve();
            });
        });
    }
}

module.exports = ChangelogScraper;