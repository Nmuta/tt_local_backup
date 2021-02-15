import { GuidLikeString } from '@models/extended-types';

export interface GravitySaveState {
  userInventoryId: GuidLikeString;
  lastLoginUtc: Date;
}