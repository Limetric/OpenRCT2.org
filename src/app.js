#!/usr/bin/env node

import {cwd, chdir} from 'node:process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import * as Sentry from '@sentry/node';
import {CaptureConsole as CaptureConsoleIntegration, ExtraErrorData as ExtraErrorDataIntegration} from '@sentry/integrations';
import {Config} from './misc/config.js';
import HTTPServer from './http/http.js';
import {ReleasesParser} from './modules/releasesParser/releasesParser.js';
import {ChangelogParser} from './modules/changelogParser/changelogParser.js';
import {VersionUtils} from './utils/version.js';

const appDirectory = join(dirname(fileURLToPath(import.meta.url)), '..');

const appTitle = `OpenRCT2.org ${VersionUtils.getVersion()}`;
console.log('#'.repeat(appTitle.length));
console.log(appTitle);
console.log('#'.repeat(appTitle.length));

// Force working directory
if (cwd() !== appDirectory) {
  chdir(appDirectory);

  console.log(`Changed working directory: ${appDirectory}`);
} else {
  console.log(`Working directory: ${appDirectory}`);
}

console.info(`Environment: ${Config.environment}`);

ReleasesParser.checkUpdate().catch((error) => {
  console.error(error);
});
ChangelogParser.checkUpdate().catch((error) => {
  console.error(error);
});

// Get default HTTP server instance
const httpServer = HTTPServer.instance;

// Initialize Sentry
const {dsn} = Config.get('sentry');
Sentry.init({
  enabled: !Config.development,
  dsn,
  release: VersionUtils.getVersion(),
  environment: Config.environment,
  integrations: [
    new Sentry.Integrations.Http(),
    new CaptureConsoleIntegration({
      levels: ['warn', 'error', 'assert'],
    }),
    new ExtraErrorDataIntegration(),
  ],
  tracesSampleRate: Config.development ? 1.0 : 0.1,
});

// Initialize HTTP server
await httpServer.initialize();
await httpServer.listen();

console.info('Application is initialized and ready for use');
