import { GravityInventoryItem } from './gravity-inventory-item.model';

/** Interface for gravity player car item. */
export interface GravityCar extends GravityInventoryItem {
  vin: string;
  purchaseUtc: unknown;
  currentMasteryRank: BigInt;
  cumulativeMastery: BigInt;
  repairState: BigInt;
  starPoints: BigInt;
  color: BigInt;
  livery: BigInt;
  clientPr: BigInt;
  advancedCarCustomization: BigInt;
}
