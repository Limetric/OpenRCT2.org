#!/usr/bin/env node

import {cwd, chdir} from 'node:process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import PackageJson from '../package.json' assert {type: 'json'};
import log from './utils/log.js';
import Config from './misc/config.js';
import HTTPServer from './http/http.js';
import ReleasesParser from './modules/releasesParser/index.js';
import ChangelogParser from './modules/changelogParser/index.js';

const appDirectory = join(dirname(fileURLToPath(import.meta.url)), '..');

console.log('#############################');
console.log(`OpenRCT2.org v${PackageJson.version}`);
console.log('#############################');

// Force working directory
if (cwd() !== appDirectory) {
  chdir(appDirectory);

  console.log(`Changed working directory: ${appDirectory}`);
} else {
  console.log(`Working directory: ${appDirectory}`);
}

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
