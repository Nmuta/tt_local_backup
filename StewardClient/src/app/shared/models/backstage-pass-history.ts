import BigNumber from 'bignumber.js';
import { DateTime } from 'luxon';

/** Interface for a backstage pass history event. */
export interface BackstagePassHistory {
  createdAtUtc: DateTime;
  uniqueId: string;
  transactionType: string;
  backstagePassAmount: BigNumber;
}
