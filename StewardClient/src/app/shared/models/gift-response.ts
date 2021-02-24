import { GiftIdentityAntecedent } from '@shared/constants';

/** Interface for a gifting response. */
export interface GiftResponse<T> {
  playerOrLspGroup: T;
  identityAntecedent: GiftIdentityAntecedent;
  error: unknown;
}
