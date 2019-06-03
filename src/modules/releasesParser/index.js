import RPN from 'request-promise-native';
import log from '../../utils/log';
import Firestore from '../../misc/firestore';
import UrlHandler from '../urlHandler';
import FirestoreUtils from '../../utils/firestore';
import StringUtils from '../../utils/string';

export default class ReleasesParser {
    /**
     * Check for new releases
     * @returns {void}
     */
    static async checkUpdate() {
        //Schedule next fetch
        setTimeout(this.checkUpdate.bind(this), 3600 * 1000);

        /**
         * @type {Map<string, string>}
         */
        const urls = new Map();
        urls.set('https://api.github.com/repos/OpenRCT2/OpenRCT2/releases', 'releases');
        urls.set('https://api.github.com/repos/Limetric/OpenRCT2-binaries/releases', '*');

        for (const [url, type] of urls) {
            const options = {
                url,
                json: true,
                headers: {
                    'User-Agent': 'OpenRCT2.org'
                }
            };

            try {
                const jsonData = await RPN(options);
                await this.parse(jsonData, type);
            } catch (error) {
                log.error(error);
                return;
            }
        }

        log.debug('Fetched releases');
    }

    /**
     * Parse content
     * @param {Object} jsonData
     * @param {string} type
     * @returns {Promise<void>}
     */
    static parse(jsonData, type) {
        return new Promise(async (resolve, reject) => {
            for (const jsonReleaseData of jsonData) {
                //Skip drafts
                if (jsonReleaseData['draft'])
                    continue;

                try {
                    await this.parseReleaseData(jsonReleaseData, type);
                } catch (error) {
                    log.warn(error);
                }

            }

            resolve();
        });
    }

    /**
     * @type {FirebaseFirestore.CollectionReference}
     */
    static #collection = Firestore.collection('releases');

    /**
     * Parse release data
     * @param data
     * @param {string} type
     * @returns {Promise<void>}
     */
    static async parseReleaseData(data, type) {
        return new Promise(async (resolve, reject) => {
            let commit;
            let branch = type;
            let notes;

            //Get commit and branch from release body
            if (type === '*') {
                /**
                 * @type {string}
                 */
                const bodyStr = data['body'];
                if (typeof (bodyStr) !== 'string' || !bodyStr.includes(';'))
                    throw new Error('Invalid body');

                const body = bodyStr.split(';');
                if (body.length !== 2)
                    throw new Error('Unexpected body length');

                commit = StringUtils.substringBetween(body[0], '`', '`').toLowerCase();
                branch = StringUtils.substringBetween(body[1], '`', '`').toLowerCase();
            } else
                notes = data['body'];

            const docPath = `${branch}-${data['id']}`;
            const releaseDoc = this.#collection.doc(docPath);
            try {
                if (!(await releaseDoc.get()).exists) {
                    await releaseDoc.set({
                        id: data['id'],
                        name: data['name'] ? data['name'] : null,
                        version: data['tag_name'],
                        created: data['created_at'] ? new Date(data['created_at']) : null,
                        published: data['published_at'] ? new Date(data['published_at']) : null,
                        url: data['html_url'],
                        commit: commit ? commit : null,
                        notes: notes ? notes : null,
                        branch: branch ? branch : null
                    }, {
                        merge: true
                    });

                    log.info(`Stored '${docPath}' in Firestore`);
                }
            } catch (error) {
                reject(error);
                return;
            }

            //Parse assets
            const assetsCol = releaseDoc.collection('assets');
            if (data['assets']) {
                for (const assetData of data['assets']) {
                    const assetDocRef = assetsCol.doc(`${assetData['id']}`);

                    try {
                        const assetResult = await assetDocRef.get();
                        if (!assetResult.exists) {
                            const url = assetData['browser_download_url'];
                            await assetDocRef.set({
                                id: assetData['id'],
                                url,
                                fileSize: assetData['size'],
                                fileName: assetData['name'],
                                fileHash: await UrlHandler.getHash(url)
                            });
                        }
                    } catch (error) {
                        log.warn(error);
                    }
                }
            } else {
                //Delete all documents from collection
                try {
                    await FirestoreUtils.deleteCollection(assetsCol, 10);
                } catch (error) {
                    log.warn(error);
                }
            }

            resolve();
        });
    }
}