import { ApolloInventoryItem } from './apollo-inventory-item.model';

/** Interface for sunrise car item. */
export interface ApolloCar extends ApolloInventoryItem {
  vin: string;
  baseCost: number;
  collectorScore: number;
  isOnlineOnly: boolean;
  productionNumber: number;
  purchaseUtc: unknown;
  versionedLiveryId: unknown;
  versionedTuneId: unknown;
}
