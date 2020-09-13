import { Locale } from '../locale';

const locale: Locale = {
  months: ['1 сар', '2 сар', '3 сар', '4 сар', '5 сар', '6 сар', '7 сар', '8 сар', '9 сар', '10 сар', '11 сар', '12 сар'],
  monthsShort: ['1сар', '2сар', '3сар', '4сар', '5сар', '6сар', '7сар', '8сар', '9сар', '10сар', '11сар', '12сар'],
  weekdays: ['Ням', ' Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'],
  weekdaysShort: ['Ням', ' Дав', 'Мяг', 'Лха', 'Пүр', 'Баа', 'Бям'],
  weekdaysMin: ['Ня', ' Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя'],
  firstDayOfWeek: 1,
  firstWeekContainsDate: 1,
  meridiemParse: /Өг|Ор/,
  meridiem(hour) {
    if (hour < 12) {
      return 'Өг';
    }
    return 'Ор';
  },
  isPM(input) {
    return input === 'Ор';
  },
};

export default locale;
