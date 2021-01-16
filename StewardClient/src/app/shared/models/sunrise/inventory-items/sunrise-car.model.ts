import { SunriseInventoryItem } from './sunrise-inventory-item.model';

/** Interface for sunrise car item. */
export interface SunriseCar extends SunriseInventoryItem {
  vin: string;
  baseCost: number;
  collectorScore: number;
  isOnlineOnly: boolean;
  productionNumber: number;
  purchaseUtc: unknown;
  versionedLiveryId: unknown;
  versionedTuneId: unknown;
}
