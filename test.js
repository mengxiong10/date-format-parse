const fecha = require('./index');
const parse = require('./dayjs');
const moment = require('moment');

moment('2019-10-09 at 10:22:23', 'YYYY-MM-DD HH:mm:ss');

console.log(fecha);

fecha.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

fecha.parse('2019-10-09 at 10:22:23', 'YYYY-MM-DD [at] HH:mm:ss');

const a = parse('2019-10-09 at 10:22:23', 'YYYY-MM-DD HH:mm:ss');
console.log(a);
