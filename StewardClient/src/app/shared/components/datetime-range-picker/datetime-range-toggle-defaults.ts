import { DatetimeRangeOption } from '@components/datetime-range-picker/date-range-picker/date-range-picker.component';
import { DateTime } from 'luxon';

export const DATE_TIME_TOGGLE_OPTIONS: DatetimeRangeOption[] = [
  {
    name: 'Last Week',
    start: DateTime.local().minus({ day: 7 }),
    end: DateTime.local(),
  },
  {
    name: 'Last Month',
    start: DateTime.local().minus({ day: 30 }),
    end: DateTime.local(),
  },
  {
    name: 'Last Year',
    start: DateTime.local().minus({ year: 1 }),
    end: DateTime.local(),
  },
];
