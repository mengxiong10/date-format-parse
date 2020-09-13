import { Locale } from '../locale';

const locale: Locale = {
  months: ['1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар', '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар'],
  monthsShort: ['1 сар', '2 сар', '3 сар', '4 сар', '5 сар', '6 сар', '7 сар', '8 сар', '9 сар', '10 сар', '11 сар', '12 сар'],
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
