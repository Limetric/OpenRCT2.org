import Firestore from '@google-cloud/firestore';
import Config from '../config';

const db = new Firestore({
    projectId: Config.firestore['projectId'],
    keyFilename: Config.firestore['keyFilename'],
});

/**
 * Delete all documents in a collection
 * @param {object} collectionRef
 * @param {number} batchSize
 * @returns {Promise<void>}
 */
db.deleteCollection = (collectionRef, batchSize) => {
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
};

const deleteQueryBatch = (db, query, batchSize, resolve, reject) => {
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
            deleteQueryBatch(db, query, batchSize, resolve, reject);
        });
    })
        .catch(reject);
};


export default db;