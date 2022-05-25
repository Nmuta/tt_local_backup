import BigNumber from 'bignumber.js';

export interface UnbanResult {
  banEntryId: BigNumber;
  success: boolean;
  deleted: boolean;
}

export type UnbanResults = UnbanResult[];
