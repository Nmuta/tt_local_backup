import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import moment from 'moment';

/** Interface for a community message. */
export interface CommunityMessage {
  message: string;
  expiryDate: moment.Moment;
  duration: moment.Duration;
}

/** Interface for a bulk community message. */
export interface BulkCommunityMessage extends CommunityMessage {
  xuids: BigNumber[];
}

/** Interface for a community message result. */
export interface CommunityMessageResult<T> {
  identity: T;
  identityAntecedent: GiftIdentityAntecedent;
  success: boolean;
}
