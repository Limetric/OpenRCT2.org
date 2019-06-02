import RPN from 'request-promise-native';
import log from '../../utils/log';
import Firestore from '../../misc/firestore';
import Hash from 'object-hash';

export default class ChangelogParser {
    /**
     * Check for changelog updates
     * @returns {void}
     */
    static async checkUpdate() {
        //Schedule next fetch
        setTimeout(this.checkUpdate.bind(this), 3600 * 1000);

        const options = {
            url: 'https://raw.githubusercontent.com/OpenRCT2/OpenRCT2/develop/distribution/changelog.txt',
            json: true,
            headers: {
                'User-Agent': 'OpenRCT2.org'
            }
        };

        let changes;
        try {
            const rawContent = await RPN(options);
            changes = await this.parse(rawContent);
        } catch (error) {
            log.error(error);
            return;
        }

        if (changes > 0)
            log.info(`Updated ${changes} changesets`);
        else
            log.debug('No changesets update');
    }

    /**
     * Parse changelog raw content
     * @param {string} rawContentStr
     * @returns {Promise<number>}
     */
    static parse(rawContentStr) {
        return new Promise(async (resolve, reject) => {
            const rawContent = rawContentStr.split('\n');

            //Filter versions
            const changesets = [];

            let processingChangeset;

            rawContent.forEach((str, index) => {
                if (!str.startsWith('------')) {
                    if (!processingChangeset)
                        return;

                    //Skip malformed changes
                    str = str.trim();
                    if (!str || !str.startsWith('- '))
                        return;

                    //Push change
                    processingChangeset.changes.push(str.substring(2));

                    return;
                }

                const versionName = rawContent[index - 1];
                if (!versionName)
                    return;

                const changeset = processingChangeset = {
                    versionName,
                    changes: []
                };
                changesets.push(changeset);
            });

            let changesCount = 0;

            /**
             * @type {FirebaseFirestore.CollectionReference}
             */
            const changesetsCollection = Firestore.collection('changesets');
            for (const changeset of changesets) {
                /**
                 *
                 * @type {FirebaseFirestore.DocumentReference}
                 */
                const changesetDoc = changesetsCollection.doc(changeset.versionName);

                //Generate changes hash to compare against Firestore
                changeset.changesHash = Hash(changeset.changes);

                /**
                 * @type {FirebaseFirestore.DocumentSnapshot}
                 */
                let snapshot;
                try {
                    snapshot = await changesetDoc.get();

                    if (snapshot.exists) {
                        const data = snapshot.data();
                        //Check if changes hash is the same
                        if (data.changesHash === changeset.changesHash)
                            continue;
                    }

                    const data = {
                        versionName: changeset.versionName,
                        updated: new Date(),
                        changesHash: changeset.changesHash,
                        changes: changeset.changes
                    };
                    if (!snapshot.exists)
                        data.created = new Date();

                    await changesetDoc.set(data, {
                        merge: true
                    });

                    changesCount++;
                } catch(error) {
                    log.error(error);
                }
            }

            resolve(changesCount);
        });
    }
}