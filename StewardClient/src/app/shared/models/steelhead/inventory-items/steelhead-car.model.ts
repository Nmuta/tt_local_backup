import BigNumber from 'bignumber.js';
import { GuidLikeString } from '@models/extended-types';
import { SteelheadInventoryItem } from './steelhead-inventory-item.model';

/** Interface for steelhead car item. */
export interface SteelheadCar extends SteelheadInventoryItem {
  vin: GuidLikeString;
  baseCost: BigNumber;
  collectorScore: BigNumber;
  isOnlineOnly: boolean;
  productionNumber: BigNumber;
  purchaseUtc: DateTime;
  versionedLiveryId: GuidLikeString;
  versionedTuneId: GuidLikeString;
}
