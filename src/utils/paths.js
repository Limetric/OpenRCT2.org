import Path from 'path';

export default class Paths {
    static get data() {
        return Path.join(__dirname, '../..', 'data');
    }
}