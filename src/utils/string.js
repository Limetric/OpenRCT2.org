export default class StringUtils {
    /**
     * Sub string between
     * @param {string} str
     * @param {string} after
     * @param {string} before
     */
    static substringBetween(str, after, before) {
        return str.substring(
            str.indexOf(after) + after.length,
            str.lastIndexOf(before));
    }
}