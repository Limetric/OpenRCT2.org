import Path from 'node:path';

export default class Paths {
  static get data() {
    return Path.join(__dirname, '../..', 'data');
  }
}
