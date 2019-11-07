import { isDate, toDate, isValidDate } from '../src/util';

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
