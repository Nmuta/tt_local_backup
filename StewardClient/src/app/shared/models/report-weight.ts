import BigNumber from 'bignumber.js';

/** Report weight type */
export enum ReportWeightType {
  Default = 'Default',
  LockedToAutoFlagReview = 'LockedToAutoFlagReview',
  LockedToZero = 'LockedToZero',
}

/** A user's report weight. */
export interface UserReportWeight {
  weight: BigNumber;
  type: ReportWeightType;
}
