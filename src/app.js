#!/usr/bin/env node
import '@babel/polyfill';
import 'source-map-support/register';

const appVersion = require('../package').version;
console.log('#############################');
console.log(`OpenRCT2.org v${appVersion}`);
console.log('#############################');

import log from './utils/log';
import Config from './config';
import HTTPServer from './http/';
import Releases from './modules/releasesParser/';

(async () => {
    log.info(`Current environment: ${Config.environment}`);

    try {
        await HTTPServer.instance.listen();
    } catch (error) {
        log.error(error);
        process.exit(1);
        return;
    }

    log.info('Application is initialized and ready for use');
})();