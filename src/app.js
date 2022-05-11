#!/usr/bin/env node

import PackageJson from '../package.json' assert { type: 'json' };
import log from './utils/log.js';
import Config from './misc/config.js';
import HTTPServer from './http/http.js';
import ReleasesParser from './modules/releasesParser/index.js';
import ChangelogParser from './modules/changelogParser/index.js';

console.log('#############################');
console.log(`OpenRCT2.org v${PackageJson.version}`);
console.log('#############################');

(async () => {
  try {
    log.info(`Current environment: ${Config.environment}`);

    ReleasesParser.checkUpdate();
    ChangelogParser.checkUpdate();

    const httpServer = HTTPServer.instance;
    await httpServer.initialize();
    await httpServer.listen();

    log.info('Application is initialized and ready for use');
  } catch (error) {
    log.fatal(error);
    process.exit(1);
  }
})();
