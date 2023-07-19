import { GiftIdentityAntecedent } from '@shared/constants';
import { StewardError } from './steward-error';

/** Interface for a gifting response. */
export interface GiftResponse<T> {
  playerOrLspGroup: T;
  identityAntecedent: GiftIdentityAntecedent;
  errors: StewardError[];
}
