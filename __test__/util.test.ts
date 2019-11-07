import { isDate, toDate, isValidDate, getWeek } from '../src/util';

describe('isDate', () => {
  it('when value is invalid date return true ', () => {
    expect(isDate(new Date(NaN))).toBe(true);
  });

  it('when value is date return true ', () => {
    expect(isDate(new Date())).toBe(true);
  });

  ['1', 0, null, undefined].forEach(v => {
    it(`when value is ${v} return false`, () => {
      expect(isDate(v)).toBe(false);
    });
  });
});

describe('toDate', () => {
  it('when value is Date return Equal Date', () => {
    const date = new Date();
    expect(toDate(date)).not.toBe(date);
    expect(toDate(date)).toEqual(date);
  });

  it('when value is null or undefined return invalid date', () => {
    expect(toDate(null).getTime()).toEqual(NaN);
    expect(toDate(undefined).getTime()).toEqual(NaN);
  });

  it('when value is number or string return Date', () => {
    expect(toDate(0)).toEqual(new Date(0));
  });
});

describe('isValidDate', () => {
  it('when value is not Date', () => {
    expect(isValidDate(0)).toBe(false);
  });

  it('when value is invalid date', () => {
    expect(isValidDate(new Date(NaN))).toBe(false);
  });

  it('when value is valid date', () => {
    expect(isValidDate(new Date())).toBe(true);
  });
});

describe('getWeek', () => {
  it('returns the local week of year of the given date', () => {
    const result = getWeek(new Date(2005, 0, 2));
    expect(result).toBe(2);
  });

  it('handles dates before 100 AD', () => {
    const initialDate = new Date(0);
    initialDate.setFullYear(7, 11, 30);
    initialDate.setHours(0, 0, 0, 0);
    const result = getWeek(initialDate);
    expect(result).toBe(1);
  });

  it('returns NaN if the given date is invalid', () => {
    const result = getWeek(new Date(NaN));
    expect(result).toBeNaN();
  });

  it('allows to specify `firstDayOfWeek` and `firstWeekContainsDate` in locale', () => {
    const date = new Date(2005, 0, 2);
    const result = getWeek(date, { firstDayOfWeek: 1, firstWeekContainsDate: 4 });
    expect(result).toBe(53);
  });

  it('throws `RangeError` if `options.firstDayOfWeek` is not convertable to 0, 1, ..., 6 or undefined', () => {
    // $ExpectedMistake
    const block = getWeek.bind(null, new Date(2007, 11, 31), { firstDayOfWeek: 7 });
    expect(block).toThrow();
  });

  it('throws `RangeError` if `options.firstWeekContainsDate` is not convertable to 1, 2, ..., 7 or undefined', () => {
    // $ExpectedMistake
    const block = getWeek.bind(null, new Date(2007, 11, 31), { firstWeekContainsDate: 10 });
    expect(block).toThrow();
  });
});
