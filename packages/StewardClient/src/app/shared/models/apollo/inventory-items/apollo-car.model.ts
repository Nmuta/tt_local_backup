import BigNumber from 'bignumber.js';
import { GuidLikeString } from '@models/extended-types';
import { ApolloInventoryItem } from './apollo-inventory-item.model';

/** Interface for sunrise car item. */
export interface ApolloCar extends ApolloInventoryItem {
  vin: GuidLikeString;
  baseCost: BigNumber;
  collectorScore: BigNumber;
  isOnlineOnly: boolean;
  productionNumber: BigNumber;
  purchaseUtc: DateTime;
  versionedLiveryId: GuidLikeString;
  versionedTuneId: GuidLikeString;
}
