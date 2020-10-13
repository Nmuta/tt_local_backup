import { GravityInventoryItem } from './gravity-inventory-item.model';

/** Interface for gravity player car item. */
export interface GravityCar extends GravityInventoryItem {
  vin?: any;
  purchaseUtc?: any;
  currentMasteryRank?: number;
  cumulativeMastery?: number;
  repairState?: number;
  starPoints?: number;
  color?: number;
  livery?: number;
  clientPr?: number;
  advancedCarCustomization?: number;
}
