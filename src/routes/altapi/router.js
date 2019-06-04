import log from '../../utils/log';
import Releases from '../../misc/releases';
import Multiparty from 'multiparty';
import Config from '../../config';
import Octokit from '@octokit/rest';
import fs from 'fs';

const octokit = new Octokit({
    auth: Config.altApi['gitHub']['personalAccessToken']
});

export default class AltApiRouter {
    #router;

    get router() {
        return this.#router;
    }

    /**
     * Verify key validity
     * @param {string} key
     * @returns {boolean} validity
     */
    static #verifyKey(key) {
        if (!key)
            return false;

        const keys = Config.altApi['accessKeys'];
        if (typeof (keys) !== 'object')
            return false;

        return typeof (keys[key]) !== 'undefined';
    }

    /**
     * Parse form input
     * @param req
     * @returns {Promise<void>}
     */
    static #parseFormInput(req) {
        return new Promise((resolve, reject) => {
            const form = new Multiparty.Form({
                maxFields: 20
            });
            form.parse(req, (error, fields, files) => {
                if (error) {
                    reject(error);
                    return;
                }

                //Append form data to body
                for (const [key, array] of Object.entries(fields)) {
                    const value = array.length ? array[0] : undefined;
                    if (!value)
                        continue;

                    req.body[key] = value;
                }

                req.body['files'] = [];
                for (const array of Object.values(files)) {
                    const file = array.length ? array[0] : undefined;
                    if (!file)
                        continue;

                    req.body['files'].push({
                        filename: file['originalFilename'],
                        fileSize: file['size'],
                        path: file['path'],
                        contentType: file['headers'] ? file['headers']['content-type'] : undefined
                    });
                }

                resolve();
            });
        });
    }

    /**
     *
     * @param req
     * @param res
     * @returns {void}
     */
    static async #pushBuild(req, res) {
        //Parse form input data
        try {
            await this.#parseFormInput(req);
        } catch (error) {
            log.error(error);
            res.json({
                error: 1,
                errorMessage: 'Failed to parse input'
            });
            return;
        }

        //Check input validity
        if (!req.body['key'] || !req.body['version'] || !req.body['gitHash'] || !req.body['gitBranch'] || !req.body['fileName']) {
            res.json({
                error: 1,
                errorMessage: 'Invalid data input'
            });
            return;
        }

        //Check for file input
        if (!req.body['files'].length) {
            res.json({
                error: 1,
                errorMessage: 'Invalid file input'
            });
            return;
        }

        //Verify access key
        if (!this.#verifyKey(req.body['key'])) {
            res.json({
                error: 1,
                errorMessage: 'Invalid access key'
            });
            return;
        }

        const versionName = `v${req.body['version']}-${req.body['gitHash'].substr(0, 7)}`;

        const ghConfig = Config.altApi['gitHub'];

        let ghRelease;
        try {
            ghRelease = await octokit.repos.getReleaseByTag({
                owner: ghConfig['owner'],
                repo: ghConfig['repo'],
                tag: versionName,
            });
        } catch (error) {
            //An error is also thrown when it doesn't exist
            log.debug(error);
        }

        if (!ghRelease || !ghRelease.data) {
            try {
                ghRelease = await octokit.repos.createRelease({
                    owner: ghConfig['owner'],
                    repo: ghConfig['repo'],
                    tag_name: versionName,
                    draft: false,
                    prerelease: false,
                    body: `\`${req.body['gitHash']}\`;\`${req.body['gitBranch']}\``
                });
            } catch (error) {
                log.error(error);
                res.json({
                    error: 1,
                    errorMessage: 'Failed to create GitHub release'
                });
                return;
            }
            log.debug(`Created new '${versionName}' GitHub release`);
        } else
            log.debug(`Using existing '${versionName}' GitHub release`);

        const uploadUrl = ghRelease && ghRelease.data ? ghRelease.data['upload_url'] : undefined;
        const file = req.body['files'][0];

        try {
            file.content = await new Promise((resolve, reject) => {
                fs.readFile(file['path'], (error, data) => {
                    if (error)
                        reject(error);
                    else
                        resolve(data);
                });
            });
            await octokit.repos.uploadReleaseAsset({
                url: uploadUrl,
                name: req.body['fileName'],
                file: file.content,
                headers: {
                    'content-length': file.fileSize,
                    'content-type': file.contentType
                }
            });
        } catch (error) {
            log.error(error);
            res.json({
                error: 1,
                errorMessage: 'Failed to upload GitHub release asset. May already exist.'
            });
            return;
        }

        log.info(`Processed AltApi asset upload for '${versionName}'`);

        res.json({
            message: 'Processed!'
        });
    }

    /**
     *
     * @param req
     * @param res
     * @returns {void}
     */
    static async #getLatestDownload(req, res) {
        let branch = req.body['gitBranch'] || req.query['gitBranch'];
        if (branch === 'master')
            branch = 'releases';
        if (!branch || !['develop', 'releases'].includes(branch)) {
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
            const releases = await Releases.getLastByBranch(branch, 1);
            release = releases.length ? releases[0] : undefined;
        } catch (error) {
            log.warn(error);
        }
        if (!release) {
            res.json({
                error: 1,
                errorMessage: 'No branch release available.'
            });
            return;
        }

        const asset = release.getAssetByFlavourId(flavourId);
        if (!asset) {
            res.json({
                error: 1,
                errorMessage: 'No download available.'
            });
            return;
        }

        //User agent "Mozilla/5.0" is used by launcher, which doesn't support redirect URLs
        const supportsRedirects = req.get('User-Agent') !== 'Mozilla/5.0' || typeof (req.body['redirects']) !== 'undefined' || typeof (req.query['redirects']) !== 'undefined';
        let url = asset.url;
        if (!supportsRedirects) {
            try {
                url = await asset.redirlessUrl;
            } catch (error) {
                log.warn(error);
            }
        }

        let commit = release.commit;
        let commitShort = release.commitShort;
        const fileHash = asset.fileHash;
        //Fake commit hashes based on file hash
        if (!commit) {
            commit = fileHash.substring(0, 40);
            commitShort = commit.substring(0, 7);
        }

        res.json({
            buildId: release.id,
            downloadId: `${release.version}-${release.branch}-${release.commitShort ? release.commitShort : fileHash.substring(0, 7)}`,
            fileSize: asset.fileSize,
            url,
            fileHash,
            gitHash: commit,
            gitHashShort: commitShort,
            addedTime: release.published,
            addedTimeUnix: release.published.getTime() / 1000
        });
    }

    constructor(httpServer) {
        const router = this.#router = httpServer.newRouter();
        router.all('/', async (req, res, next) => {
            const command = req.body['command'] || req.query['command'];

            if (command === 'push-build') {
                this.constructor.#pushBuild(req, res);
            } else if (command === 'get-latest-download') {
                this.constructor.#getLatestDownload(req, res);
            } else {
                res.json({
                    error: 1,
                    errorMessage: 'Unknown command.'
                });
            }
        });
    }
}
