import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { floor, isDate, isNumber } from 'lodash';

export function angularCalendarCustomFactory(): DateAdapter {
  const adapter = adapterFactory();
  const oldIsSameSecond = adapter.isSameSecond;

  adapter.isSameSecond = function (dateLeft: Date | number, dateRight: Date | number): boolean {
    if (isDate(dateLeft)) {
      dateLeft = dateLeft.getTime();
    }
    if (isDate(dateRight)) {
      dateRight = dateRight.getTime();
    }

    if (isNumber(dateLeft) && isNumber(dateRight)) {
      return floor(dateLeft / 1000) === floor(dateRight / 1000);
    }

    return oldIsSameSecond(dateLeft, dateRight);
  };

  return adapter;
}
