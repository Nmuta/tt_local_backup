import { GiftHistoryAntecedent } from '@shared/constants';

/** Interface for a gifting response. */
export interface GiftResponse<T> {
  playerOrLspGroup: T;
  identityAntecedent: GiftHistoryAntecedent;
  error: unknown;
}
