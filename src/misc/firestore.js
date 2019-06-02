import Firestore from '@google-cloud/firestore';
import Config from '../config';

/**
 * @type {Firestore}
 */
const db = new Firestore({
    projectId: Config.firestore['projectId'],
    keyFilename: Config.firestore['keyFilename'],
});

export default db;