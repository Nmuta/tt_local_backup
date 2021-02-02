import { SunriseInventoryItem } from './sunrise-inventory-item.model';

/** Interface for sunrise car item. */
export interface SunriseCar extends SunriseInventoryItem {
  vin: string;
  baseCost: BigInt;
  collectorScore: BigInt;
  isOnlineOnly: boolean;
  productionNumber: BigInt;
  purchaseUtc: unknown;
  versionedLiveryId: unknown;
  versionedTuneId: unknown;
}
