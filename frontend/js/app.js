//Babel Polyfill must always be first
require('babel-polyfill');

//Display dates and fromNow dates
const moment = require('moment');
for (const el of document.querySelectorAll('.date')) {
    const parentheses = el.classList.contains('parentheses');
    el.textContent = (parentheses ? '(' : '') + moment(new Date(el.dataset.date || el.textContent)).format(el.dataset.format) + (parentheses ? ')' : '');
}
for (const el of document.querySelectorAll('.fromNow')) {
    const parentheses = el.classList.contains('parentheses');
    el.textContent = (parentheses ? '(' : '') + moment(new Date(el.dataset.date || el.textContent)).fromNow() + (parentheses ? ')' : '');
}