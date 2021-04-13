import BigNumber from 'bignumber.js';
import { GuidLikeString } from '@models/extended-types';
import { SunriseInventoryItem } from './sunrise-inventory-item.model';

/** Interface for sunrise car item. */
export interface SunriseCar extends SunriseInventoryItem {
  vin: GuidLikeString;
  baseCost: BigNumber;
  collectorScore: BigNumber;
  isOnlineOnly: boolean;
  productionNumber: BigNumber;
  purchaseUtc: Date;
  versionedLiveryId: GuidLikeString;
  versionedTuneId: GuidLikeString;
}
