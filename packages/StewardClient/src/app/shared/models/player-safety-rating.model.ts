import BigNumber from 'bignumber.js';

/** Enum for a player's safety rating grade. */
export enum SafetyRatingGrade {
  SPlus = 'SPlus',
  S = 'S',
  SMinus = 'SMinus',
  APlus = 'APlus',
  A = 'A',
  AMinus = 'AMinus',
  BPlus = 'BPlus',
  B = 'B',
  BMinus = 'BMinus',
  CPlus = 'CPlus',
  C = 'C',
  CMinus = 'CMinus',
  DPlus = 'DPlus',
  D = 'D',
  DMinus = 'DMinus',
  EPlus = 'EPlus',
  E = 'E',
  EMinus = 'EMinus',
  Unknown = 'Unknown',
}

/** Interface for a player's safety rating. */
export interface SafetyRating {
  configuration: SafetyRatingConfig;
  grade: SafetyRatingGrade;
  score: BigNumber;
  isInProbationaryPeriod: boolean;
  probationaryScoreEstimate: BigNumber;
}

/** Interface for a safety rating input. */
export interface SafetyRatingInput {
  safetyScores: number[];
}

/** Interface for a safety rating configuration. */
export interface SafetyRatingConfig {
  probationRaceCount: BigNumber;
  minScore: BigNumber;
  maxScore: BigNumber;
}
