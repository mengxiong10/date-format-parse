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

// it('fails with an invalid format', () => {
//   const input = '2018-05-02 12:00 PM';
//   const format = 'C';
//   expect(
//     parse(input, format)
//       .format()
//       .toLowerCase()
//   ).toBe(
//     moment(input, format)
//       .format()
//       .toLowerCase()
//   );
// });

// it('correctly parse month from string after changing locale globally', () => {
//   const input = '2018 лютий 03';
//   const format = 'YYYY MMMM DD';

//   const parseLocale = parse().$locale();
//   const momentLocale = moment.locale();
//   try {
//     parse.locale(uk);
//     moment.locale('uk');
//     expect(parse(input, format).valueOf()).toBe(moment(input, format).valueOf());
//   } finally {
//     parse.locale(parseLocale);
//     moment.locale(momentLocale);
//   }
// });

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
