import Firestore from '@google-cloud/firestore';
import Config from '../config';
const firestoreConfig = Config.cloud['firestore'];

const db = new Firestore({
    projectId: firestoreConfig['projectId'],
    keyFilename: firestoreConfig['keyFilename'],
});

export default db;