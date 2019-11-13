const path = require('path');
const fs = require('fs');
const moment = require('moment/min/moment-with-locales');
const libLocales = path.resolve(__dirname, '../node_modules/moment/locale');

const localLocalePath = path.resolve(__dirname, '../src/locale');

function writeFile(key, data) {
  fs.writeFile(path.join(localLocalePath, `${key}.ts`), data, err => {
    if (err) {
      throw err;
    }
  });
}

function getTemplate(key) {
  const lang = moment.localeData(key);
  const result = {
    months: lang.months(),
    monthsShort: lang.monthsShort(),
    weekdays: lang.weekdays(),
    weekdaysShort: lang.weekdaysShort(),
    weekdaysMin: lang.weekdaysMin(),
    firstDayOfWeek: lang._week.dow || 0,
    firstWeekContainsDate: lang._week.doy || 1,
  };
  const template = `
import { Locale } from '../locale';

const locale: Locale = ${JSON.stringify(result)}

export default locale;
  `;
  return template.trim();
}

function test() {
  fs.readdirSync(localLocalePath).forEach(name => {
    if (!/\.ts$/.test(name)) {
      return;
    }
    const key = name.replace(/\.ts$/, '');
    const data = getTemplate(key);
    writeFile(key, data);
  });
}

function generateLocales() {
  fs.readdirSync(libLocales).forEach((name, i) => {
    const key = name.replace(/\.js$/, '');
    const data = getTemplate(key);
  });

  // Object.keys(libLocales).forEach(locale => {
  //   const name = `${locale.replace(/([a-z])([A-Z])/, '$1-$2')}`;
  //   const data = getTemplate({ locale, name });
  //   const filename = `${name}.js`;
  //   fs.writeFile(path.join(localLocalePath, filename), data, err => {
  //     if (err) {
  //       throw err;
  //     }
  //   });
  // });
}

generateLocales();
// test();
