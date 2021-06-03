import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import { DateTime, Duration } from 'luxon';

/** Interface for a community message. */
export interface CommunityMessage {
  message: string;
  expiryDate: DateTime;
  duration: Duration;
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
