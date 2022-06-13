/**
 * Class to update the, usually, already formatted `time` HTML elements into a client-side localized format (timezone differences, etc.)
 */
export class DateFormatter {
  static #locale = 'en';

  static #formatRelativeDate(date) {
    const formatter = new Intl.RelativeTimeFormat(this.#locale, {
      numeric: 'auto',
    });

    const DIVISIONS = [
      {amount: 60, name: 'seconds'},
      {amount: 60, name: 'minutes'},
      {amount: 24, name: 'hours'},
      {amount: 7, name: 'days'},
      {amount: 4.34524, name: 'weeks'},
      {amount: 12, name: 'months'},
      {amount: Number.POSITIVE_INFINITY, name: 'years'},
    ];

    let duration = (date - new Date()) / 1000;

    for (let i = 0; i <= DIVISIONS.length; i++) {
      const division = DIVISIONS[i];
      if (Math.abs(duration) < division.amount) {
        return formatter.format(Math.round(duration), division.name);
      }
      duration /= division.amount;
    }

    return 'Unknown';
  }

  /**
   * Format date
   *
   * @param {Date} date Date
   * @param {HTMLElement} element HTML element
   * @returns {string} Formatted date
   */
  static #formatDate(date, element) {
    return date.toLocaleString(this.#locale, {
      dateStyle: element.dataset.dateStyle !== (false).toString() ? element.dataset.dateStyle : undefined,
      timeStyle: element.dataset.timeStyle !== (false).toString() ? element.dataset.timeStyle : undefined,
    });
  }

  static run() {
    for (const element of document.querySelectorAll('time')) {
      // Skip already localized elements
      if (element.dataset.localized === (true).toString()) {
        continue;
      }

      // Parse date from timestamp
      const date = new Date(element.getAttribute('datetime'));

      // eslint-disable-next-line no-nested-ternary
      element.textContent = element.dataset.relative === (true).toString() ? (element.dataset.full === (true).toString() ? `${this.#formatRelativeDate(date)}: ${this.#formatDate(date, element)}` : this.#formatRelativeDate(date)) : this.#formatDate(date, element);

      // Optional title tooltip
      let titleContent = '';
      if (element.dataset.title === (true).toString()) {
        titleContent = this.#formatDate(date);
      }
      element.title = titleContent;

      // Set localized state
      element.dataset.localized = (true).toString();
    }
  }
}
