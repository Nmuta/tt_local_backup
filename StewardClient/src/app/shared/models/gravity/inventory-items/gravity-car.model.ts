import BigNumber from 'bignumber.js';
import { GuidLikeString } from '@models/extended-types';
import { GravityInventoryItem } from './gravity-inventory-item.model';

/** Interface for gravity player car item. */
export interface GravityCar extends GravityInventoryItem {
  vin: GuidLikeString;
  purchaseUtc: Date;
  currentMasteryRank: BigNumber;
  cumulativeMastery: BigNumber;
  repairState: BigNumber;
  starPoints: BigNumber;
  color: BigNumber;
  livery: BigNumber;
  clientPr: BigNumber;
  advancedCarCustomization: BigNumber;
}
