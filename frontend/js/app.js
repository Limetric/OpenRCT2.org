//Babel Polyfill must always be first
require('babel-polyfill');

//Display dates and fromNow dates
const Moment = require('moment');
for (const el of document.querySelectorAll('.date')) {
    const parentheses = el.classList.contains('parentheses');
    const moment = Moment(new Date(el.dataset.date || el.textContent));
    const formattedMoment = moment.format(el.dataset.format);
    el.textContent = (parentheses ? '(' : '') + formattedMoment + (parentheses ? ')' : '');

    //Set date to element title
    if (el.classList.contains('titleDate'))
        el.setAttribute('title', formattedMoment);
}
for (const el of document.querySelectorAll('.fromNow')) {
    const parentheses = el.classList.contains('parentheses');
    const moment = Moment(new Date(el.dataset.date || el.textContent));
    el.textContent = (parentheses ? '(' : '') + moment.fromNow() + (parentheses ? ')' : '');

    //Set date to element title
    if (el.classList.contains('titleDate'))
        el.setAttribute('title', moment.format(el.dataset.format));
}