import { GuidLikeString } from '@models/extended-types';
import { DateTime } from 'luxon';

/** Models hide-able UGC from Sunrise. */
export interface SunriseHideableUgc {
  title: string;
  description: string;
  ugcId: GuidLikeString;
  sharecode: string;
  previewUrl: string;
  submissionUtc: DateTime;
  hiddenUtc: DateTime;
}
