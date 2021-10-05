import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import { DateTime, Duration } from 'luxon';
import { MSError } from './error.model';
import { Merge } from './extended-types';

/** Interface for a community message. */
export interface GenericCommunityMessage {
  message: string;
  expiryDate: DateTime;
  duration: Duration;
}

/** Interface for a bulk community message. */
export interface BulkCommunityMessage extends GenericCommunityMessage {
  xuids: BigNumber[];
}

/** Interface for an LSP group community message. */
export interface LspGroupCommunityMessage extends GenericCommunityMessage {
  deviceType: string;
}

export type CommunityMessage = Merge<GenericCommunityMessage, LspGroupCommunityMessage>;

/** Interface for a community message result. */
export interface CommunityMessageResult<T> {
  playerOrLspGroup: T;
  identityAntecedent: GiftIdentityAntecedent;
  error: MSError;
}
