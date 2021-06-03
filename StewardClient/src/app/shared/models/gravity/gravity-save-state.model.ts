import { GuidLikeString } from '@models/extended-types';
import { DateTime } from 'luxon';

export interface GravitySaveState {
  userInventoryId: GuidLikeString;
  lastLoginUtc: DateTime;
}
