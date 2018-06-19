//Babel Polyfill must always be first
require('babel-polyfill');

const moment = require('moment');
for (const el of document.querySelectorAll('.date')) {
    el.textContent = moment(new Date(el.dataset.date || el.textContent)).format(el.dataset.format);
}

console.log('JS loaded');