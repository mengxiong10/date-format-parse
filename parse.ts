import { isValidDate } from './util';

const formattingTokens = /(\[[^[]*\])|([-:/.()\s]+)|(YYYY|YY|MM?M?M?|Do|DD?|ddd?d?|hh?|HH?|mm?|ss?|S{1,3}|a|A|x|X|ZZ?)/g;

const match1 = /\d/; // 0 - 9
const match2 = /\d\d/; // 00 - 99
const match3 = /\d{3}/; // 000 - 999
const match4 = /\d{4}/; // 0000 - 9999
const match1to2 = /\d\d?/; // 0 - 99
const matchShortOffset = /[+-]\d\d:?\d\d/; // +00:00 -00:00 +0000 or -0000
const matchSigned = /[+-]?\d+/; // -inf - inf
const matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

const matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i; // Word

const YEAR = 'year';
const MONTH = 'month';
const DAY = 'day';
const HOUR = 'hours';
const MINUTE = 'minutes';
const SECOND = 'seconds';
const MILLISECOND = 'milliseconds';
const WEEK = 7;
const WEEKDAY = 8;

const expressions = {};

const addParseFlag = (token, regex, callback) => {
  let func = callback;
  if (typeof callback === 'number') {
    func = input => {
      return [callback, parseInt(input, 10)];
    };
  }
  const tokens = Array.isArray(token) ? token : [token];
  tokens.forEach(key => {
    expressions[key] = [regex, func];
  });
};

addParseFlag('YY', match2, input => {
  const year = new Date().getFullYear();
  const cent = Math.floor(year / 100);
  let value = parseInt(input, 10);
  value = (value > 68 ? cent - 1 : cent) * 100 + value;
  return [YEAR, value];
});
addParseFlag('YYYY', match4, YEAR);
addParseFlag('M', match1to2, input => [MONTH, parseInt(input, 10) - 1]);
addParseFlag('MM', match2, input => [MONTH, parseInt(input, 10) - 1]);
addParseFlag('MMM', matchWord, (input, locale) => {
  const { monthsShort } = locale;
  const index = monthsShort.findIndex(month => month === input);
  if (index < 0) {
    throw new Error('Invalid Month');
  }
  return [MONTH, index];
});
addParseFlag('MMMM', matchWord, (input, locale) => {
  const { months } = locale;
  const index = months.findIndex(month => month === input);
  if (index < 0) {
    throw new Error('Invalid Month');
  }
  return [MONTH, index];
});
addParseFlag('D', match1to2, DAY);
addParseFlag('DD', match2, DAY);
addParseFlag(['H', 'h'], match1to2, HOUR);
addParseFlag(['HH', 'hh'], match2, HOUR);
addParseFlag('m', match1to2, MINUTE);
addParseFlag('mm', match2, MINUTE);
addParseFlag('s', match1to2, SECOND);
addParseFlag('ss', match2, SECOND);
addParseFlag('S', match1, input => {
  return [MILLISECOND, +input * 100];
});
addParseFlag('SS', match1, input => {
  return [MILLISECOND, +input * 10];
});
addParseFlag('SSS', match1, MILLISECOND);

function matchMeridiem(locale) {
  return locale.meridiemParse || /[ap]\.?m?\.?/i;
}
function defaultIsPM(input) {
  return (input + '').toLowerCase().charAt(0) === 'p';
}

addParseFlag(['A', 'a'], matchMeridiem, (input, locale) => {
  const isPM = typeof locale.isPM === 'function' ? locale.isPM(input) : defaultIsPM;
  return ['isPM', isPM(input)];
});

function offsetFromString(str) {
  const [symbol, hour, minute] = str.match(/([+-]|\d\d)/g) || ['-', 0, 0];
  const minutes = parseInt(hour, 10) * 60 + parseInt(minute, 10);

  return minutes === 0 ? 0 : symbol === '+' ? minutes : -minutes;
}

addParseFlag(['Z', 'ZZ'], matchShortOffset, input => {
  return ['offset', offsetFromString(input)];
});

addParseFlag('x', matchSigned, input => {
  return ['date', new Date(parseInt(input, 10))];
});

addParseFlag('X', matchTimestamp, input => {
  return ['date', new Date(parseFloat(input) * 1000)];
});

function parse(input, format, { locale, backupDate }) {
  let string = String(input);
  const tokens = format.match(formattingTokens);
  const { length } = tokens;
  let start = 0;
  const mark: any = {};
  for (let i = 0; i < length; i += 1) {
    const token = tokens[i];
    const parseTo = expressions[token];
    if (!parseTo) {
      start += token.replace(/^\[|\]$/g, '').length;
    } else {
      const part = string.substr(start);
      const regex = typeof parseTo[0] === 'function' ? parseTo[0](locale) : parseTo[0];
      const parser = parseTo[1];
      const value = (regex.exec(part) || [])[0];
      const [k, v] = parser(value);
      mark[k] = v;
      string = string.replace(value, '');
    }
  }
  const { isPM } = mark;
  if (isPM !== undefined) {
    if (isPM) {
      if (mark.hours < 12) {
        mark.hours += 12;
      }
    } else if (mark.hours === 12) {
      mark.hours = 0;
    }
  }
  const defaultDate = isValidDate(backupDate) ? backupDate : new Date(new Date().getFullYear(), 0, 1);
  // const utcDate =
}

function createUTCDate(y, m, ...args: number[]) {
  let date;
  if (y < 100 && y >= 0) {
    y += 400;
    date = new Date(Date.UTC(y, m, ...args));
    if (isFinite(date.getUTCFullYear())) {
      date.setUTCFullYear(y);
    }
  } else {
    date = new Date(Date.UTC(y, m, ...args));
  }

  return date;
}

// const parseFormattedInput = (input, format, utc) => {
//   try {
//     const parser = makeParser(format);
//     const { year, month, day, hours, minutes, seconds, milliseconds, zone } = parser(input);
//     if (zone) {
//       return new Date(Date.UTC(year, month - 1, day, hours || 0, minutes || 0, seconds || 0, milliseconds || 0) + zone.offset * 60 * 1000);
//     }
//     const now = new Date();
//     const y = year || now.getFullYear();
//     const M = month > 0 ? month - 1 : now.getMonth();
//     const d = day || now.getDate();
//     const h = hours || 0;
//     const m = minutes || 0;
//     const s = seconds || 0;
//     const ms = milliseconds || 0;
//     if (utc) {
//       return new Date(Date.UTC(y, M, d, h, m, s, ms));
//     }
//     return new Date(y, M, d, h, m, s, ms);
//   } catch (e) {
//     return new Date(''); // Invalid Date
//   }
// };
