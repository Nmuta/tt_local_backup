import { GuidLikeString } from '@models/extended-types';
import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';
import { ApolloGift } from './apollo-gift.model';

/** Interface for Apollo gift history. */
export interface ApolloGiftHistory {
  idType: GiftIdentityAntecedent;
  id: BigNumber;
  title: 'apollo';
  giftSendDateUtc: DateTime;
  giftInventory: ApolloGift;
  requesterObjectId: GuidLikeString;
}
