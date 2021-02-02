import { ApolloInventoryItem } from './apollo-inventory-item.model';

/** Interface for sunrise car item. */
export interface ApolloCar extends ApolloInventoryItem {
  vin: string;
  baseCost: BigInt;
  collectorScore: BigInt;
  isOnlineOnly: boolean;
  productionNumber: BigInt;
  purchaseUtc: unknown;
  versionedLiveryId: unknown;
  versionedTuneId: unknown;
}
