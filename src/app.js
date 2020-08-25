#!/usr/bin/env node
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'source-map-support/register';

import PackageJson from '../package.json';
import log from './utils/log';
import Config from './misc/config';
import HTTPServer from './http/http';
import ReleasesParser from './modules/releasesParser';
import ChangelogParser from './modules/changelogParser';

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
