var REGEX_FORMAT = /\[([^\]]+)]|YY(?:YY)?|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|s{1,2}|Z{1,2}|S{1,3}|a|A/g;
function pad(val, len) {
  if (len === void 0) {
    len = 2;
  }
  var output = Math.abs(val).toString();
  while (output.length < len) {
    output = '0' + output;
  }
  return output;
}
function formatTimezone(offset, delimeter) {
  if (delimeter === void 0) {
    delimeter = '';
  }
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  return sign + pad(hours, 2) + delimeter + pad(minutes, 2);
}
var defaultLocale = {
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  weekdaysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
};
var meridiem = function(hours, minutes, isLowercase) {
  var m = hours < 12 ? 'AM' : 'PM';
  return isLowercase ? m.toLocaleLowerCase() : m;
};
var formatters = {
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
    var hours = formatters['h'](date);
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
  // AM, PM
  A: function(date, locale) {
    var meridiemFunc = locale.meridiem || meridiem;
    return meridiemFunc(date.getHours(), date.getMinutes(), false);
  },
  // am, pm
  a: function(date, locale) {
    var meridiemFunc = locale.meridiem || meridiem;
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
function format(val, str, options) {
  if (options === void 0) {
    options = {};
  }
  var formatStr = str ? String(str) : 'YYYY-MM-DDTHH:mm:ss.SSSZ';
  var date = val instanceof Date ? new Date(val.getTime()) : new Date(val);
  if (isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  var locale = options.locale || defaultLocale;
  return formatStr.replace(REGEX_FORMAT, function(match, p1) {
    if (p1) {
      return p1;
    }
    if (typeof formatters[match] === 'function') {
      return '' + formatters[match](date, locale);
    }
    return match;
  });
}

const a = format(new Date(), 'YYYY-MM-DD');

console.log(a);
