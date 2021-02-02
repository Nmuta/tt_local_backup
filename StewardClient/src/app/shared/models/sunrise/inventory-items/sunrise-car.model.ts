import { GuidLikeString } from '@models/extended-types';
import { SunriseInventoryItem } from './sunrise-inventory-item.model';

/** Interface for sunrise car item. */
export interface SunriseCar extends SunriseInventoryItem {
  vin: GuidLikeString;
  baseCost: BigInt;
  collectorScore: BigInt;
  isOnlineOnly: boolean;
  productionNumber: BigInt;
  purchaseUtc: Date;
  versionedLiveryId: GuidLikeString;
  versionedTuneId: GuidLikeString;
}
