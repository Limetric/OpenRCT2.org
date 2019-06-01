class Asset {
    /**
     * @type {Release}
     */
    #parentRelease;

    constructor(parentRelease) {
        this.#parentRelease = parentRelease;
    }

    /**
     * @type {number}
     */
    #id;

    /**
     * @type {string}
     */
    #fileName;

    /**
     * @type {string}
     */
    #url;

    /**
     * @type {string}
     */
    #platform;

    /**
     * @type {string}
     */
    #architecture;

    /**
     * @type {number}
     */
    #fileSize;

    /**
     * @type {string}
     */
    #title;

    /**
     * @type {string}
     */
    #fileHash;

    /**
     * Get GitHub asset ID
     * @returns {number}
     */
    get id() {
        return this.#id;
    }

    /**
     * Set GitHub asset ID
     * @param {number} value
     */
    set id(value) {
        this.#id = value;
    }

    /**
     * Get file name
     * @returns {string}
     */
    get fileName() {
        return this.#fileName;
    }

    /**
     * Set file name
     * @param {string} fileName
     */
    set fileName(fileName) {
        this.#fileName = fileName;
    }

    /**
     * Get GitHub download url
     * @returns {string}
     */
    get url() {
        return this.#url;
    }

    /**
     * Set GitHub download url
     * @param {string} value
     */
    set url(value) {
        this.#url = value;
    }

    /**
     * Get category
     * @returns {string}
     */
    get category() {
        let category = this.platform;

        if (this.fileName.includes('-symbols') || this.fileName.includes('-debugsymbols'))
            category = 'misc';

        return category;
    }

    /**
     * Get platform
     * @returns {string}
     */
    get platform() {
        if (this.#platform)
            return this.#platform;

        if (!this.fileName)
            return undefined;

        let platform;
        if (this.fileName.includes('-windows'))
            platform = 'windows';
        else if (this.fileName.includes('-macos'))
            platform = 'macos';
        else if (this.fileName.includes('-linux'))
            platform = 'linux';
        else if (this.fileName.includes('-android'))
            platform = 'android';
        else
            platform = 'misc';


        this.platform = platform;
        return platform;
    }

    /**
     * Set platform
     * @param {string} platform
     */
    set platform(platform) {
        this.#platform = platform;
    }

    /**
     * Get architecture
     * @returns {string}
     */
    get architecture() {
        if (this.#architecture)
            return this.#architecture;

        if (!this.fileName)
            return undefined;

        let architecture;
        if (this.fileName.includes('-x64') || this.fileName.includes('-win64'))
            architecture = 'x64';
        else if (this.fileName.includes('-x86_64'))
            architecture = 'x86_64';
        else if (this.fileName.includes('-x86') || this.fileName.includes('-win32'))
            architecture = 'x86';

        this.architecture = architecture;
        return architecture;
    }

    /**
     * Set architecture
     * @param {string} architecture
     */
    set architecture(architecture) {
        this.#architecture = architecture;
    }

    /**
     * Get title
     * @returns {string}
     */
    get title() {
        if (this.#title)
            return this.#title;

        if (!this.fileName)
            return undefined;

        let title;
        if (this.fileName.includes('-installer'))
            title = 'Installer';
        else if (this.fileName.includes('-portable'))
            title = 'Portable ZIP';
        else if (this.fileName.includes('-symbols') || this.fileName.includes('-debugsymbols'))
            title = 'Debug Symbols';

        this.title = title;
        return title;
    }

    /**
     * Get flavour id
     * @deprecated
     * @returns {number}
     */
    get flavourId() {
        const platform = this.category;
        const architecture = this.architecture;
        const title = this.title;

        if (platform === 'windows') {
            if (architecture === 'x64')
                return title === 'Portable ZIP' ? 6 : title === 'Installer' ? 7 : 10;
            else
                return title === 'Portable ZIP' ? 1 : title === 'Installer' ? 2 : 5;
        } else if (platform === 'macos')
            return 3;
        else if (platform === 'linux')
            return architecture === 'x86_64' || architecture === 'x64' ? 9 : 4;
        else if (platform === 'android')
            return architecture === 'arm' ? 11 : architecture === 'x86' ? 12 : 0;

        return 0;
    }

    /**
     * Set title
     * @param {string} title
     */
    set title(title) {
        this.#title = title;
    }

    /**
     * Get file size
     * @returns {number}
     */
    get fileSize() {
        return this.#fileSize;
    }

    /**
     * Set file size
     * @param {number} fileSize
     */
    set fileSize(fileSize) {
        this.#fileSize = fileSize;
    }

    /**
     * Get file SHA-256 hash sum
     * @returns {string}
     */
    get fileHash() {
        return this.#fileHash;
    }

    /**
     * Set file SHA-256 hash sum
     * @param {string} fileHash
     */
    set fileHash(fileHash) {
        this.#fileHash = fileHash;
    }
}

export default class Release {
    /**
     * @type {number}
     */
    #id;

    /**
     * @type {string}
     */
    #name;

    /**
     * @type {string}
     */
    #version;

    /**
     * @type {Date}
     */
    #created;

    /**
     * @type {Date}
     */
    #published;

    /**
     * @type {string}
     */
    #url;

    /**
     * @type {string}
     */
    #notes;

    /**
     * @type {string}
     */
    #branch;

    /**
     * @type {string}
     */
    #build;

    /**
     * @type {Set<Asset>}
     */
    #assets = new Set();

    /**
     * Get GitHub release ID
     * @returns {number}
     */
    get id() {
        return this.#id;
    }

    /**
     * Set GitHub release ID
     * @param {number} value
     */
    set id(value) {
        this.#id = value;
    }

    /**
     * Get name
     * @returns {string}
     */
    get name() {
        if (!this.#name)
            return this.version;

        return this.#name;
    }

    /**
     * Set name
     * @param {string} value
     */
    set name(value) {
        this.#name = value;
    }

    /**
     * Get version (tag name)
     * @returns {string}
     */
    get version() {
        return this.#version;
    }

    /**
     * Set version (tag name)
     * @param {string} value
     */
    set version(value) {
        this.#version = value;
    }

    /**
     * Get created date
     * @returns {Date}
     */
    get created() {
        return this.#created;
    }

    /**
     * Set created date
     * @param value
     */
    set created(value) {
        if (typeof (value) === 'string' && value)
            value = new Date(value);
        this.#created = value;
    }

    /**
     * Get published date
     * @returns {Date}
     */
    get published() {
        return this.#published;
    }

    /**
     * Set published date
     * @param {Date|string} value
     */
    set published(value) {
        if (typeof (value) === 'string' && value)
            value = new Date(value);

        this.#published = value;
    }

    /**
     * Get GitHub url
     * @returns {string}
     */
    get url() {
        return this.#url;
    }

    /**
     * Set GitHub url
     * @param {string} value
     */
    set url(value) {
        this.#url = value;
    }

    /**
     * Get notes
     * @returns {string}
     */
    get notes() {
        return this.#notes;
    }

    /**
     * Set notes
     * @param {string} value
     */
    set notes(value) {
        this.#notes = value;
    }

    /**
     * Get branch
     * @returns {string}
     */
    get branch() {
        return this.#branch;
    }

    /**
     * Set branch
     * @param {string} branch
     */
    set branch(branch) {
        this.#branch = branch;
    }

    /**
     * Get build
     * @returns {string}
     */
    get build() {
        return this.#build;
    }

    /**
     * Set build
     * @param {string} value
     */
    set build(value) {
        this.#build = value;
    }

    /**
     * Get long release title
     */
    get longTitle() {
        const branch = this.branch === 'releases' ? 'release' : this.branch;

        return `${this.name} ${branch}`;
    }

    /**
     * Get short release title
     * @returns {string}
     */
    get shortTitle() {
        const branch = this.branch === 'releases' ? 'release' : this.branch;

        return `${this.version} ${branch}`;
    }

    /**
     * Get assets
     * @returns {Set<Asset>}
     */
    get assets() {
        return this.#assets;
    }

    /**
     * @param {FirebaseFirestore.QueryDocumentSnapshot} snapshot
     * @returns {Promise<void>}
     */
    parseSnapshot(snapshot) {
        return new Promise(async (resolve, reject) => {
            const data = snapshot.data();
            this.#id = data['id'];
            this.#name = data['name'];
            this.#version = data['version'];
            this.#created = data['created'] ? data['created'].toDate() : undefined;
            this.#published = data['published'] ? data['published'].toDate() : undefined;
            this.#url = data['url'];
            this.#notes = data['notes'];
            this.#branch = data['branch'];

            //Parse assets
            let assetsSnapshot;
            try {
                assetsSnapshot = await snapshot.ref.collection('assets').get();
            } catch (error) {
                reject(error);
                return;
            }

            this.assets.clear();
            for (const assetSnapshot of assetsSnapshot.docs) {
                const assetData = assetSnapshot.data();

                const asset = new Asset();
                asset.id = assetData['id'];
                asset.url = assetData['url'];
                asset.fileSize = assetData['fileSize'];
                asset.fileName = assetData['fileName'];
                asset.fileHash = assetData['fileHash'];
                this.assets.add(asset);
            }

            resolve();
        });
    }

    /**
     * Get assets by platform
     * @param {string} platform
     * @returns {Set<Asset>}
     */
    getAssetsByPlatform(platform) {
        const output = new Set();
        for (const asset of this.assets) {
            if (asset.platform === platform)
                output.add(asset);
        }
        return output;
    }

    /**
     * Get assets by category
     * @param {string} category
     * @returns {Set<Asset>}
     */
    getAssetsByCategory(category) {
        const output = new Set();
        for (const asset of this.assets) {
            if (asset.category === category)
                output.add(asset);
        }
        return output;
    }

    /**
     * Get asset by flavour id
     * @deprecated
     * @param {number} flavourId
     * @returns {Asset}
     */
    getAssetByFlavourId(flavourId) {
        for (const asset of this.assets) {
            if (asset.flavourId === flavourId)
                return asset;
        }
        return undefined;
    }
}