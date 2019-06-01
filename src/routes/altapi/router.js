import log from '../../utils/log';
import Releases from '../../misc/releases';

export default class AltApiRouter {
    #router;

    get router() {
        return this.#router;
    }

    /**
     *
     * @param req
     * @param res
     * @returns {void}
     */
    async getLatestDownload(req, res) {
        let gitBranch = req.body['gitBranch'] || req.query['gitBranch'];
        if (gitBranch === 'master')
            gitBranch = 'releases';
        if (!gitBranch || !['develop', 'releases'].includes(gitBranch)) {
            res.json({
                error: 1,
                errorMessage: 'Invalid branch specified.'
            });
            return;
        }

        const flavourId = parseInt(req.body['flavourId'] || req.query['flavourId'], 10);
        if (isNaN(flavourId)) {
            res.json({
                error: 1,
                errorMessage: 'Invalid flavour id specified.'
            });
            return;
        }

        let release;
        try {
            release = await Releases.getLastByBranch(gitBranch);
        } catch(error) {
            log.warn(error);
        }
        if (!release) {
            res.json({
                error: 1,
                errorMessage: 'Error. Develop downloads will be fixed on Thursday.'
            });
            return;
        }

        const download = release.getAssetByFlavourId(flavourId);
        if (!download) {
            res.json({
                error: 1,
                errorMessage: 'No download available.'
            });
            return;
        }

        let fileHash;
        try {
            fileHash = await download.fileHash
        } catch(error) {
            log.warn(error);
        }

        res.json({
            buildId: release.id,
            downloadId: release.id,
            fileSize: download.fileSize,
            url: download.url,
            fileHash,
            //gitHash: '',
            //gitHashShort: '',
            addedTime: release.published,
            addedTimeUnix: release.published.getTime() / 1000
            //`downloadFlavour` is used by OpenRCT2Launcher but wasn't in original AltApi
        });
    }

    constructor(httpServer) {
        const router = this.#router = httpServer.newRouter();
        router.get('/', async (req, res, next) => {
            const command = req.body['command'] || req.query['command'];

            if (command === 'push-build') {
                res.json({
                    error: 1,
                    errorMessage: 'Pushing is currently disabled.'
                });
            } else if (command === 'get-latest-download') {
                this.getLatestDownload(req, res);
            } else {
                res.json({
                    error: 1,
                    errorMessage: 'Unknown command.'
                });
            }
        });
    }
}
