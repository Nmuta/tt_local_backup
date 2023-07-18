import BigNumber from 'bignumber.js';
import { GuidLikeString } from '@models/extended-types';
import { WoodstockInventoryItem } from './woodstock-inventory-item.model';

/** Interface for woodstock car item. */
export interface WoodstockCar extends WoodstockInventoryItem {
  vin: GuidLikeString;
  baseCost: BigNumber;
  collectorScore: BigNumber;
  isOnlineOnly: boolean;
  productionNumber: BigNumber;
  purchaseUtc: DateTime;
  versionedLiveryId: GuidLikeString;
  versionedTuneId: GuidLikeString;
}
