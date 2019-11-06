import moment from 'moment';
import parse from '../parse';

it('parse month format(M)', () => {
  var input = '2018-1-02 01:02:03.004';
  var format = 'YYYY-M-DD HH:mm:ss.SSS';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('parse month format(MM)', () => {
  var input = '2018-01-02 01:02:03.004';
  var format = 'YYYY-MM-DD HH:mm:ss.SSS';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('parse month format(MMM)', () => {
  const input = '4/Mar/2019:11:16:26';
  const format = 'D/MMM/YYYY:H:m:s';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('parse month format(MMMM)', () => {
  const input = '2018 February 03';
  const format = 'YYYY MMMM DD';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('parse padded string(HH:mm:ss)', () => {
  var input = '2018-05-02 01:02:03.004';
  var format = 'YYYY-MM-DD HH:mm:ss.SSS';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('parse unpadded string(H:m:s)', () => {
  const input = '2.5.18 1:2:3.4';
  const format = 'D.M.YY H:m:s.S';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('parse time zone (Z) ', () => {
  var input = '01/01/2019 01:02:03.004 +01:00';
  var format = 'DD/MM/YYYY HH:mm:ss.SSS Z';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('parse time zone (ZZ) ', () => {
  var input = '2018-01-01 01:02:03.004 -0100';
  var format = 'YYYY-MM-DD HH:mm:ss.SSS ZZ';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('timezone with zero', () => {
  const input = '2018-05-02 +0000';
  const format = 'YYYY-MM-DD ZZ';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('parse am (a)', () => {
  const input = '2018-05-02 12:00 am';
  const format = 'YYYY-MM-DD hh:mm a';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('parse AM (A)', () => {
  const input = '2018-05-02 12:00 AM';
  const format = 'YYYY-MM-DD hh:mm A';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('parse pm (a)', () => {
  const input = '2018-05-02 12:00 pm';
  const format = 'YYYY-MM-DD hh:mm a';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('parse PM (A)', () => {
  const input = '2018-05-02 12:00 PM';
  const format = 'YYYY-MM-DD hh:mm A';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('parse hh:mm', () => {
  const input = '12:00';
  const format = 'hh:mm';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('parse HH:mm:ss', () => {
  const input = '00:27:21';
  const format = 'HH:mm:ss';
  expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
});

it('correct weekday', () => {
  const expected = new Date(2019, 9, 1);
  expect(parse('2 2019-10-1', 'd YYYY-MM-D')).toEqual(expected);
  expect(parse('Tu 2019-10-1', 'dd YYYY-MM-D')).toEqual(expected);
  expect(parse('Tue 2019-10-1', 'ddd YYYY-MM-D')).toEqual(expected);
  expect(parse('Tuesday 2019-10-1', 'dddd YYYY-MM-D')).toEqual(expected);
});

it('incorrect weekday', () => {
  const expected = new Date(NaN).valueOf();
  expect(parse('3 2019-10-1', 'd YYYY-MM-D').valueOf()).toEqual(expected);
  expect(parse('ww 2019-10-1', 'dd YYYY-MM-D').valueOf()).toEqual(expected);
  expect(parse('Mo 2019-10-1', 'dd YYYY-MM-D').valueOf()).toEqual(expected);

  expect(parse('www 2019-10-1', 'ddd YYYY-MM-D').valueOf()).toEqual(expected);
  expect(parse('Mon 2019-10-1', 'ddd YYYY-MM-D').valueOf()).toEqual(expected);

  expect(parse('www 2019-10-1', 'dddd YYYY-MM-D').valueOf()).toEqual(expected);
  expect(parse('Monday 2019-10-1', 'dddd YYYY-MM-D').valueOf()).toEqual(expected);
});

it('backupDate', () => {
  const input = '12:00';
  const format = 'HH:mm';
  const backupDate = new Date(2010, 3, 3, 5, 5, 5, 5);
  const expected = new Date(2010, 3, 3, 12, 0, 0, 0);
  expect(parse(input, format, { backupDate })).toEqual(expected);
});

it('backupDate when year is parsed', () => {
  const input = '2019 12:00';
  const format = 'YYYY HH:mm';
  const backupDate = new Date(2010, 3, 3, 5, 5, 5, 5);
  const expected = new Date(2019, 0, 1, 12, 0, 0, 0);
  expect(parse(input, format, { backupDate })).toEqual(expected);
});

it('return Invalid Date when parse corrupt short string', () => {
  const input = '2018 Dog 03';
  const format = 'YYYY MMM DD';
  expect(parse(input, format).valueOf()).toEqual(NaN);
});

it('Invalid Dates', () => {
  expect(parse('10/12/2014', 'YYYY-MM-DD').valueOf()).toEqual(NaN);
  expect(parse('10-12-2014', 'YYYY-MM-DD').valueOf()).toEqual(NaN);
  expect(parse('2014/10/12', 'YYYY-MM-DD').valueOf()).toEqual(NaN);
});

it('correctly parse string after changing locale globally', () => {
  const locale = {
    months: ['一月', '二月'],
    monthsShort: ['一', '二'],
  };
  expect(parse('2018年 二月 9号', 'YYYY年 MMMM D号', { locale })).toEqual(new Date(2018, 1, 9));
  expect(parse('2018 一 09', 'YYYY MMM DD', { locale })).toEqual(new Date(2018, 0, 9));
});

// it('correctly parse ordinal', () => {
//   const input = '7th March 2019';
//   const input2 = '17th March 2019';
//   const inputFalse = '7st March 2019';
//   const inputZHCN = '7日 三月 2019';
//   const format = 'Do MMMM YYYY';
//   expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
//   expect(parse(input2, format).valueOf()).toBe(moment(input2, format).valueOf());
//   expect(parse(inputFalse, format).valueOf()).toBe(moment(inputFalse, format).valueOf());
//   expect(parse(inputZHCN, format, 'zh-cn').valueOf()).toBe(moment(inputZHCN, format, 'zh-cn').valueOf());
// });
