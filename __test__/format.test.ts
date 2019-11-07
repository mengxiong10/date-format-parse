import moment from 'moment';
import format from '../src/format';
import parse from '../src/parse';

it('format full', () => {
  const date = new Date(2019, 5, 9, 6, 6, 9, 1);
  const fmt = 'YYYY-MM-DD HH:mm:ss.SSS';
  const dateString = format(date, fmt);
  expect(dateString).toBe(moment(date).format(fmt));
  expect(parse(dateString, fmt)).toEqual(date);
});

it('format short', () => {
  const date = new Date(2019, 5, 9, 6, 6, 9, 0);
  const fmt = 'YY-M-D H:m:s.S SS';
  const dateString = format(date, fmt);
  expect(dateString).toBe(moment(date).format(fmt));
  expect(parse(dateString, fmt)).toEqual(date);
});

it('format year < 100', () => {
  const date = new Date(2019, 0);
  date.setFullYear(50);
  const fmt = 'YYYY';
  const dateString = format(date, fmt);
  expect(dateString).toBe(moment(date).format(fmt));
  expect(parse(dateString, fmt)).toEqual(date);
});

it('format 12h', () => {
  const dates = [
    new Date(2019, 10, 9, 18, 6, 9), // hour > 12
    new Date(2019, 10, 9, 12, 6, 9), // hour = 12
    new Date(2019, 10, 9, 0, 6, 9), // hour = 0
    new Date(2019, 10, 9, 6, 6, 9), // hour < 12
  ];
  dates.forEach(date => {
    let fmt = 'YYYY-MM-DD hh:mm:ss a';
    let dateString = format(date, fmt);
    expect(dateString).toBe(moment(date).format(fmt));
    expect(parse(dateString, fmt)).toEqual(date);
    fmt = 'YYYY-MM-DD hh:mm:ss A';
    dateString = format(date, fmt);
    expect(dateString).toBe(moment(date).format(fmt));
    expect(parse(dateString, fmt)).toEqual(date);
  });
});

it('format long month', () => {
  const arr = ['MMM', 'MMMM'];
  arr.forEach(month => {
    const date = new Date(2019, 10, 6);
    const fmt = `YYYY-${month}-DD`;
    const dateString = format(date, fmt);
    expect(dateString).toBe(moment(date).format(fmt));
    expect(parse(dateString, fmt)).toEqual(date);
  });
});

it('format week', () => {
  const arr = ['d', 'dd', 'ddd', 'dddd'];
  arr.forEach(week => {
    const date = new Date(2019, 10, 6);
    const fmt = `YYYY-MM-DD ${week}`;
    const dateString = format(date, fmt);
    expect(dateString).toBe(moment(date).format(fmt));
    expect(parse(dateString, fmt)).toEqual(date);
  });
});

it('format timezone', () => {
  const arr = ['Z', 'ZZ'];
  arr.forEach(v => {
    const date = new Date(2019, 10, 6, 10, 6, 5);
    const fmt = `YYYY-MM-DD HH:mm:ss ${v}`;
    const dateString = format(date, fmt);
    expect(dateString).toBe(moment(date).format(fmt));
    expect(parse(dateString, fmt)).toEqual(date);
  });
});

it('format timestamp', () => {
  const arr = ['x', 'X'];
  arr.forEach(v => {
    const date = new Date(2019, 10, 6, 10, 6, 5);
    const fmt = v;
    const dateString = format(date, fmt);
    expect(dateString).toBe(moment(date).format(fmt));
    expect(parse(dateString, fmt)).toEqual(date);
  });
});

it('format escape', () => {
  const date = new Date(2019, 10, 6, 10, 6, 5);
  const fmt = 'YYYY-MM-DD [at MM] HH:mm:ss';
  const dateString = format(date, fmt);
  expect(dateString).toBe(moment(date).format(fmt));
  expect(parse(dateString, fmt)).toEqual(date);
});

it('invalid date', () => {
  const date = new Date(NaN);
  const fmt = 'YYYY';
  expect(format(date, fmt)).toBe('Invalid Date');
});
