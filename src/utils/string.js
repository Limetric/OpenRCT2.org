export default class StringUtils {
  /**
   * Sub string between
   *
   * @param {string} str Input
   * @param {string} after Copy after delimiter
   * @param {string} before Copy before delimiter
   * @returns {string} Output
   */
  static substringBetween(str, after, before) {
    return str.substring(
      str.indexOf(after) + after.length,
      str.lastIndexOf(before),
    );
  }

  /**
   * Sub string before first occurence of delimiter
   *
   * @param {string} str Input
   * @param {string} delimiter Delimiter
   * @returns {string} Output
   */
  static substringBefore(str, delimiter) {
    return str.substring(0, str.indexOf(delimiter));
  }

  /**
   * Uppercase first letter
   *
   * @param {string} str Input
   * @returns {string} Output
   */
  static uppercaseFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
