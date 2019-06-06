import db from '../misc/firestore';

export default class FirestoreUtils {
    /**
     * Delete all documents in a collection
     * @param {object} collectionRef
     * @param {number} batchSize
     * @returns {Promise<void>}
     */
    static deleteCollection(collectionRef, batchSize) {
        const query = collectionRef.orderBy('__name__').limit(batchSize);

        return new Promise((resolve, reject) => {
            this.#deleteQueryBatch(db, query, batchSize, resolve, reject);
        });
    }

    static #deleteQueryBatch(db, query, batchSize, resolve, reject) {
        query.get()
            .then((snapshot) => {
                // When there are no documents left, we are done
                if (snapshot.size === 0) {
                    return 0;
                }

                // Delete documents in a batch
                const batch = db.batch();
                snapshot.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                return batch.commit().then(() => {
                    return snapshot.size;
                });
            }).then((numDeleted) => {
            if (numDeleted === 0) {
                resolve();
                return;
            }

            // Recurse on the next process tick, to avoid
            // exploding the stack.
            process.nextTick(() => {
                this.#deleteQueryBatch(db, query, batchSize, resolve, reject);
            });
        })
            .catch(reject);
    };
}