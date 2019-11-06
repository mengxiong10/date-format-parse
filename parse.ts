import { Locale, defaultLocale } from './locale';

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

const YEAR = 0;
const MONTH = 1;
const DAY = 2;
const HOUR = 3;
const MINUTE = 4;
const SECOND = 5;
const MILLISECOND = 6;
// const WEEK = 7;
// const WEEKDAY = 8;

export type ParseFlagRegExp = RegExp | ((locale: Locale) => RegExp);
export type ParseFlagCallBack = (
  input: string,
  locale: Locale
) => [number, number] | [string, any];

const parseFlags: {
  [key: string]: [ParseFlagRegExp, ParseFlagCallBack];
} = {};

const addParseFlag = (
  token: string | string[],
  regex: ParseFlagRegExp,
  callback: ParseFlagCallBack | number
) => {
  let func: ParseFlagCallBack;
  if (typeof callback === 'number') {
    func = input => {
      return [callback, parseInt(input, 10)];
    };
  } else {
    func = callback;
  }
  const tokens = Array.isArray(token) ? token : [token];
  tokens.forEach(key => {
    parseFlags[key] = [regex, func];
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
addParseFlag('SS', match2, input => {
  return [MILLISECOND, +input * 10];
});
addParseFlag('SSS', match3, MILLISECOND);

function matchMeridiem(locale: Locale) {
  return locale.meridiemParse || /[ap]\.?m?\.?/i;
}

function defaultIsPM(input: string) {
  return (input + '').toLowerCase().charAt(0) === 'p';
}

addParseFlag(['A', 'a'], matchMeridiem, (input, locale) => {
  const isPM = typeof locale.isPM === 'function' ? locale.isPM : defaultIsPM;
  return ['isPM', isPM(input)];
});

function offsetFromString(str: string) {
  const [symbol, hour, minute] = str.match(/([+-]|\d\d)/g) || ['-', '0', '0'];
  const minutes = parseInt(hour, 10) * 60 + parseInt(minute, 10);

  return minutes === 0 ? 0 : symbol === '+' ? -minutes : +minutes;
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

interface FlagMark {
  date?: Date;
  offset?: number;
  isPM?: boolean;
}

function to24hour(hour?: number, isPM?: boolean) {
  if (hour !== undefined && isPM !== undefined) {
    if (isPM) {
      if (hour < 12) {
        return hour + 12;
      }
    } else if (hour === 12) {
      return 0;
    }
  }
  return hour;
}

type DateArgs = [number, number, number, number, number, number, number];

function getFullInputArray(
  input: Array<number | undefined>,
  backupDate = new Date()
) {
  const result: DateArgs = [0, 0, 1, 0, 0, 0, 0];
  const backupArr = [
    backupDate.getFullYear(),
    backupDate.getMonth(),
    backupDate.getDate(),
    backupDate.getHours(),
    backupDate.getMinutes(),
    backupDate.getSeconds(),
    backupDate.getMilliseconds(),
  ];
  let useBackup = true;
  for (let i = 0; i < 7; i++) {
    if (input[i] === undefined) {
      result[i] = useBackup ? backupArr[i] : result[i];
    } else {
      result[i] = input[i]!;
      useBackup = false;
    }
  }
  return result;
}

function createUTCDate(...args: DateArgs) {
  let date: Date;
  const y = args[0];
  if (y < 100 && y >= 0) {
    args[0] += 400;
    date = new Date(Date.UTC(...args));
    if (isFinite(date.getUTCFullYear())) {
      date.setUTCFullYear(y);
    }
  } else {
    date = new Date(Date.UTC(...args));
  }

  return date;
}

function makeParser(dateString: string, format: string, locale: Locale) {
  const tokens = format.match(formattingTokens);
  if (!tokens) {
    throw new Error();
  }
  const { length } = tokens;
  const mark: FlagMark = {};
  const inputArray: (number | undefined)[] = [];
  for (let i = 0; i < length; i += 1) {
    const token = tokens[i];
    const parseTo = parseFlags[token];
    if (!parseTo) {
      const word = token.replace(/^\[|\]$/g, '');
      if (dateString.indexOf(word) === 0) {
        dateString = dateString.substr(word.length);
      } else {
        throw new Error('not match');
      }
    } else {
      const regex =
        typeof parseTo[0] === 'function' ? parseTo[0](locale) : parseTo[0];
      const parser = parseTo[1];
      const value = (regex.exec(dateString) || [])[0];
      const [k, v] = parser(value, locale);
      if (typeof k === 'number') {
        inputArray[k] = v;
      } else {
        mark[k] = v;
      }
      dateString = dateString.replace(value, '');
    }
  }
  return { ...mark, inputArray };
}

export default function parse(str: string, format: string, options: any = {}) {
  try {
    const { locale = defaultLocale, backupDate } = options;
    const { isPM, date, offset, inputArray } = makeParser(str, format, locale);
    if (date) {
      return date;
    }
    inputArray[HOUR] = to24hour(inputArray[HOUR], isPM);
    const utcDate = createUTCDate(...getFullInputArray(inputArray, backupDate));
    const offsetMilliseconds =
      (offset === undefined ? utcDate.getTimezoneOffset() : offset) * 60 * 1000;
    return new Date(utcDate.getTime() + offsetMilliseconds);
  } catch (e) {
    return new Date(NaN);
  }
}
