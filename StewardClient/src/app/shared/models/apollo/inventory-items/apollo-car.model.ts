import { GuidLikeString } from '@models/extended-types';
import { ApolloInventoryItem } from './apollo-inventory-item.model';

/** Interface for sunrise car item. */
export interface ApolloCar extends ApolloInventoryItem {
  vin: GuidLikeString;
  baseCost: bigint;
  collectorScore: bigint;
  isOnlineOnly: boolean;
  productionNumber: bigint;
  purchaseUtc: Date;
  versionedLiveryId: GuidLikeString;
  versionedTuneId: GuidLikeString;
}
