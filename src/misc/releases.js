import Firestore from './firestore';
import log from '../utils/log';
import Release from './release';

export default class Releases {
    /**
     * @type {FirebaseFirestore.CollectionReference}
     */
    static #collection = Firestore.collection('releases');

    /**
     * Get last release by branch
     * @param {string} branch
     * @param {number} [limit=1]
     * @returns {Promise<Release[]>}
     */
    static getLastByBranch(branch, limit) {
        return new Promise(async (resolve, reject) => {
            if (typeof(limit) !== 'number')
                limit = 1;

            /**
             * @type {FirebaseFirestore.QuerySnapshot}
             */
            let releaseDoc;
            try {
                releaseDoc = await this.#collection.where('branch', '==', branch).orderBy('published', 'desc').limit(limit).get()
            } catch(error) {
                reject(error);
                return;
            }

            if (releaseDoc.empty) {
                resolve([]);
                return;
            }

            const releases = [];
            for (const snapshot of releaseDoc.docs) {
                const release = new Release();
                try {
                    await release.parseSnapshot(snapshot);
                } catch(error) {
                    log.warn(error);
                    continue;
                }
                releases.push(release);
            }

            resolve(releases);
        });
    }

    /**
     * Get release by branch and version
     * @param {string} branch
     * @param {string} version
     * @returns {Promise<Release>}
     */
    static getByBranchVersion(branch, version) {
        return new Promise(async (resolve, reject) => {
            /**
             * @type {FirebaseFirestore.QuerySnapshot}
             */
            let releaseDoc;
            try {
                releaseDoc = await this.#collection.where('branch', '==', branch).where('version', '==', version).limit(1).get()
            } catch(error) {
                reject(error);
                return;
            }

            if (releaseDoc.empty || releaseDoc.size !== 1) {
                resolve();
                return;
            }

            const snapshot = releaseDoc.docs[0];
            if (!snapshot.exists) {
                resolve();
                return;
            }
            const release = new Release();
            try {
                await release.parseSnapshot(snapshot);
            } catch(error) {
                reject(error);
                return;
            }
            resolve(release);
        });
    }
}