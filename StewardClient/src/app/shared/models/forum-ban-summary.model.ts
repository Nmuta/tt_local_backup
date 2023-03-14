import BigNumber from 'bignumber.js';

/** A forum ban summary. */
export interface ForumBanSummary {
  xuid: BigNumber;
  banCount: BigNumber;
}
