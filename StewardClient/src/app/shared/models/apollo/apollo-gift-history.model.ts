import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import { ApolloGift } from './apollo-gift.model';

/** Interface for Apollo gift history. */
export interface ApolloGiftHistory {
  idType: GiftIdentityAntecedent;
  id: BigNumber;
  title: 'apollo';
  giftSendDateUtc: Date;
  giftInventory: ApolloGift;
  requestingAgent: string;
}
