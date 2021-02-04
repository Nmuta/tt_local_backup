import { GuidLikeString } from '@models/extended-types';
import { GravityInventoryItem } from './gravity-inventory-item.model';

/** Interface for gravity player car item. */
export interface GravityCar extends GravityInventoryItem {
  vin: GuidLikeString;
  purchaseUtc: Date;
  currentMasteryRank: bigint;
  cumulativeMastery: bigint;
  repairState: bigint;
  starPoints: bigint;
  color: bigint;
  livery: bigint;
  clientPr: bigint;
  advancedCarCustomization: bigint;
}
