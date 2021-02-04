import { GuidLikeString } from '@models/extended-types';
import { ApolloInventoryItem } from './apollo-inventory-item.model';

/** Interface for sunrise car item. */
export interface ApolloCar extends ApolloInventoryItem {
  vin: GuidLikeString;
  baseCost: BigInt;
  collectorScore: BigInt;
  isOnlineOnly: boolean;
  productionNumber: BigInt;
  purchaseUtc: Date;
  versionedLiveryId: GuidLikeString;
  versionedTuneId: GuidLikeString;
}
