import BigNumber from 'bignumber.js';
import { StewardError } from './steward-error';

/** Interface for a User Group management (add or remove user) response. */
export interface UserGroupManagementResponse {
  xuid: BigNumber;
  error: StewardError;
}
