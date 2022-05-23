#!/usr/bin/env node

import {cwd, chdir} from 'node:process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import Package from '../package.json' assert {type: 'json'};
import {Log} from './utils/log.js';
import {Config} from './misc/config.js';
import HTTPServer from './http/http.js';
import {ReleasesParser} from './modules/releasesParser/releasesParser.js';
import {ChangelogParser} from './modules/changelogParser/changelogParser.js';

const appDirectory = join(dirname(fileURLToPath(import.meta.url)), '..');

console.log('#############################');
console.log(`OpenRCT2.org v${Package.version}`);
console.log('#############################');

// Force working directory
if (cwd() !== appDirectory) {
  chdir(appDirectory);

  console.log(`Changed working directory: ${appDirectory}`);
} else {
  console.log(`Working directory: ${appDirectory}`);
}

Log.info(`Environment: ${Config.environment}`);

ReleasesParser.checkUpdate().catch((error) => {
  Log.error(error);
});
ChangelogParser.checkUpdate().catch((error) => {
  Log.error(error);
});

const httpServer = HTTPServer.instance;
await httpServer.initialize();
await httpServer.listen();

Log.info('Application is initialized and ready for use');
