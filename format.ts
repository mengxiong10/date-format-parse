import { toDate, isValidDate } from './util';
import { defaultLocale, Locale } from './locale';

const REGEX_FORMAT = /\[([^\]]+)]|YY(?:YY)?|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|Z{1,2}|S{1,3}|a|A/g;

function pad(val: number, len = 2) {
  let output: string = Math.abs(val).toString();
  while (output.length < len) {
    output = '0' + output;
  }
  return output;
}

function formatTimezone(offset: number, delimeter = '') {
  const sign = offset > 0 ? '-' : '+';
  const absOffset = Math.abs(offset);
  const hours = Math.floor(absOffset / 60);
  const minutes = absOffset % 60;
  return sign + pad(hours, 2) + delimeter + pad(minutes, 2);
}

interface Formatter {
  [key: string]: (date: Date, locale?: Locale) => string | number;
}

const meridiem = function(
  hours: number,
  minutes: number,
  isLowercase: boolean
) {
  const m = hours < 12 ? 'AM' : 'PM';
  return isLowercase ? m.toLocaleLowerCase() : m;
};

const formatters: Formatter = {
  // Year: 00, 01, ..., 99
  YY: function(date) {
    return pad(date.getFullYear(), 4).substr(2);
  },

  // Year: 1900, 1901, ..., 2099
  YYYY: function(date) {
    return pad(date.getFullYear(), 4);
  },

  // Month: 1, 2, ..., 12
  M: function(date) {
    return date.getMonth() + 1;
  },

  // Month: 01, 02, ..., 12
  MM: function(date) {
    return pad(date.getMonth() + 1, 2);
  },

  MMM: function(date, locale) {
    return locale.monthsShort[date.getMonth()];
  },

  MMMM: function(date, locale) {
    return locale.months[date.getMonth()];
  },

  // Day of month: 1, 2, ..., 31
  D: function(date) {
    return date.getDate();
  },

  // Day of month: 01, 02, ..., 31
  DD: function(date) {
    return pad(date.getDate(), 2);
  },

  // Hour: 0, 1, ... 23
  H: function(date) {
    return date.getHours();
  },

  // Hour: 00, 01, ..., 23
  HH: function(date) {
    return pad(date.getHours(), 2);
  },

  // Hour: 1, 2, ..., 12
  h: function(date) {
    var hours = date.getHours();
    if (hours === 0) {
      return 12;
    } else if (hours > 12) {
      return hours % 12;
    } else {
      return hours;
    }
  },

  // Hour: 01, 02, ..., 12
  hh: function(date) {
    const hours = formatters['h'](date) as number;
    return pad(hours, 2);
  },

  // Minute: 0, 1, ..., 59
  m: function(date) {
    return date.getMinutes();
  },

  // Minute: 00, 01, ..., 59
  mm: function(date) {
    return pad(date.getMinutes(), 2);
  },

  // Second: 0, 1, ..., 59
  s: function(date) {
    return date.getSeconds();
  },

  // Second: 00, 01, ..., 59
  ss: function(date) {
    return pad(date.getSeconds(), 2);
  },

  // 1/10 of second: 0, 1, ..., 9
  S: function(date) {
    return Math.floor(date.getMilliseconds() / 100);
  },

  // 1/100 of second: 00, 01, ..., 99
  SS: function(date) {
    return pad(Math.floor(date.getMilliseconds() / 10), 2);
  },

  // Millisecond: 000, 001, ..., 999
  SSS: function(date) {
    return pad(date.getMilliseconds(), 3);
  },

  // Day of week: 0, 1, ..., 6
  d: function(date) {
    return date.getDay();
  },
  // Day of week: 'Su', 'Mo', ..., 'Sa'
  dd: function(date, locale) {
    return locale.weekdaysMin[date.getDay()];
  },

  // Day of week: 'Sun', 'Mon',..., 'Sat'
  ddd: function(date, locale) {
    return locale.weekdaysShort[date.getDay()];
  },

  // Day of week: 'Sunday', 'Monday', ...,'Saturday'
  dddd: function(date, locale) {
    return locale.weekdays[date.getDay()];
  },

  // AM, PM
  A: function(date, locale) {
    const meridiemFunc = locale.meridiem || meridiem;
    return meridiemFunc(date.getHours(), date.getMinutes(), false);
  },

  // am, pm
  a: function(date, locale) {
    const meridiemFunc = locale.meridiem || meridiem;
    return meridiemFunc(date.getHours(), date.getMinutes(), true);
  },

  // Timezone: -01:00, +00:00, ... +12:00
  Z: function(date) {
    return formatTimezone(date.getTimezoneOffset(), ':');
  },

  // Timezone: -0100, +0000, ... +1200
  ZZ: function(date) {
    return formatTimezone(date.getTimezoneOffset());
  },

  // Seconds timestamp: 512969520
  X: function(date) {
    return Math.floor(date.getTime() / 1000);
  },

  // Milliseconds timestamp: 512969520900
  x: function(date) {
    return date.getTime();
  },
};

function format(val: Date, str: string, options: { locale?: Locale } = {}) {
  const formatStr = str ? String(str) : 'YYYY-MM-DDTHH:mm:ss.SSSZ';
  const date = toDate(val);
  if (!isValidDate(date)) {
    return 'Invalid Date';
  }

  const locale = options.locale || defaultLocale;

  return formatStr.replace(REGEX_FORMAT, (match, p1: string) => {
    if (p1) {
      return p1;
    }
    if (typeof formatters[match] === 'function') {
      return '' + formatters[match](date, locale);
    }
    return match;
  });
}
