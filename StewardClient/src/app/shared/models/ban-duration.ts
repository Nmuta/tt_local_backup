import BigNumber from 'bignumber.js';

export interface BanDurationTimeSpan {
  days: BigNumber;
  hours: BigNumber;
  minutes: BigNumber;
  seconds: BigNumber;
}

/** Interface for a ban duration. */
export interface BanDuration {
  banDuration: BanDurationTimeSpan;
  isPermaBan: boolean;
  isDeviceBan: boolean;
}
