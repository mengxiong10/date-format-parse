import moment from 'moment';
import parse from '../src/parse';

it('parse week ww', () => {
  const inputs = ['2019-01', '2019-22', '2019-52'];
  inputs.forEach(input => {
    const fmt = 'YYYY-ww';
    expect(parse(input, fmt).valueOf()).toBe(moment(input, fmt).valueOf());
  });
});

it('parse week ww without year', () => {
  const inputs = ['01', '22', '52'];
  inputs.forEach(input => {
    const fmt = 'ww';
    expect(parse(input, fmt).valueOf()).toBe(moment(input, fmt).valueOf());
  });
});

it('parse week w', () => {
  const inputs = ['2019-1', '2019-22', '2019-52'];
  inputs.forEach(input => {
    const fmt = 'YYYY-w';
    expect(parse(input, fmt).valueOf()).toBe(moment(input, fmt).valueOf());
  });
});

it('timezone with zero', () => {
  const input = '2018-05-02 +0000';
  const fmt = 'YYYY-MM-DD ZZ';
  expect(parse(input, fmt).valueOf()).toBe(moment(input, fmt).valueOf());
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
  const fmt = 'HH:mm';
  const backupDate = new Date(2010, 3, 3, 5, 5, 5, 5);
  const expected = new Date(2010, 3, 3, 12, 0, 0, 0);
  expect(parse(input, fmt, { backupDate })).toEqual(expected);
});

it('backupDate when year is parsed', () => {
  const input = '2019 12:00';
  const fmt = 'YYYY HH:mm';
  const backupDate = new Date(2010, 3, 3, 5, 5, 5, 5);
  const expected = new Date(2019, 0, 1, 12, 0, 0, 0);
  expect(parse(input, fmt, { backupDate })).toEqual(expected);
});

it('return Invalid Date when parse corrupt short string', () => {
  const input = '2018 Dog 03';
  const fmt = 'YYYY MMM DD';
  expect(parse(input, fmt).valueOf()).toEqual(NaN);
});

it('Invalid Dates', () => {
  expect(parse('10/12/2014', 'YYYY-MM-DD').valueOf()).toEqual(NaN);
  expect(parse('10-12-2014', 'YYYY-MM-DD').valueOf()).toEqual(NaN);
  expect(parse('2014/10/12', 'YYYY-MM-DD').valueOf()).toEqual(NaN);
  expect(parse('2014/10/12', 'C').valueOf()).toEqual(NaN);
});

it('correctly parse string after changing locale globally', () => {
  const locale: any = {
    months: ['一月', '二月'],
    monthsShort: ['一.', '二'],
  };
  expect(parse('2018年 二月 9号', 'YYYY年 MMMM D号', { locale })).toEqual(new Date(2018, 1, 9));
  expect(parse('2018 一. 09', 'YYYY MMM DD', { locale })).toEqual(new Date(2018, 0, 9));
});

it('Invalid non-lenient Dates', () => {
  const lenient = false;

  expect(parse('2021-13-02 23:45:12', 'YYYY-MM-DD HH:mm:ss', { lenient }).valueOf()).toEqual(NaN);
  expect(parse('2021-07-32 23:45:12', 'YYYY-MM-DD HH:mm:ss', { lenient }).valueOf()).toEqual(NaN);
  expect(parse('2021-07-02 25:45:12', 'YYYY-MM-DD HH:mm:ss', { lenient }).valueOf()).toEqual(NaN);
  expect(parse('2021-07-02 23:65:12', 'YYYY-MM-DD HH:mm:ss', { lenient }).valueOf()).toEqual(NaN);
  expect(parse('2021-07-02 23:45:72', 'YYYY-MM-DD HH:mm:ss', { lenient }).valueOf()).toEqual(NaN);
});

it('Test lenient Dates', () => {
  expect(parse('2021-13-02 23:45:12 +0000', 'YYYY-MM-DD HH:mm:ss ZZ')).toEqual(new Date(Date.UTC(2022, 0, 2, 23, 45, 12, 0)));
  expect(parse('2021-07-32 23:45:12 +0000', 'YYYY-MM-DD HH:mm:ss ZZ')).toEqual(new Date(Date.UTC(2021, 7, 1, 23, 45, 12, 0)));
  expect(parse('2021-07-02 25:45:12 +0000', 'YYYY-MM-DD HH:mm:ss ZZ')).toEqual(new Date(Date.UTC(2021, 6, 3,  1, 45, 12, 0)));
  expect(parse('2021-07-02 22:65:12 +0000', 'YYYY-MM-DD HH:mm:ss ZZ')).toEqual(new Date(Date.UTC(2021, 6, 2, 23,  5, 12, 0)));
  expect(parse('2021-07-02 23:45:72 +0000', 'YYYY-MM-DD HH:mm:ss ZZ')).toEqual(new Date(Date.UTC(2021, 6, 2, 23, 46, 12, 0)));
});