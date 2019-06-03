export default class StringUtils {
    /**
     * Sub string between
     * @param {string} str
     * @param {string} after
     * @param {string} before
     * @returns {string}
     */
    static substringBetween(str, after, before) {
        return str.substring(
            str.indexOf(after) + after.length,
            str.lastIndexOf(before));
    }

    /**
     * Sub string before first occurence
     * @param {string} str
     * @param {string} delimiter
     * @returns {string}
     */
    static substringBefore(str, delimiter) {
        return str.substring(0, str.indexOf(delimiter));
    }
}