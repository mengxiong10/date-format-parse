const parse = require('date-fns/parse');
const moment = require('moment');

moment('2014/10/12', 'YYYY-MM-DD', true);

const a = parse('2014-10-12', 'yyyy-MM-dd', new Date());
console.log(a);
