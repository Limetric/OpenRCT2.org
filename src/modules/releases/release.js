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
     * Get GitHub ID
     * @returns {number}
     */
    get id() {
        return this.#id;
    }

    /**
     * Set GitHub ID
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

        console.log('PUBLISHED', value, typeof(value));

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
     * Parse API data
     * @param {object} data
     */
    parseAPIData(data) {
        this.id = data['id'];
        this.name = data['name'];
        this.version = data['tag_name'];
        this.created = data['created_at'];
        this.published = data['published_at'];
        this.url = data['html_url'];
        this.notes = data['body'];

        console.log('Parsed published', this.published);
    }
}