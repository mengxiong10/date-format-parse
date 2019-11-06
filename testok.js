const parse = require('date-fns/parse');
const moment = require('moment');

const b = moment('2014-10 2', 'YYYY-MM d', true);
console.log(b.toDate());

const a = parse('2014-10-12', 'yyyy-MM-dd', new Date());
console.log(a);
