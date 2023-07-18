/**
 * Interface for a record that determines if a player played
 * a past title and recieved a loyalty reward for doing so.
 */

/** Enum that represents loyalty reward titles for Woodstock. */
export enum WoodstockLoyaltyRewardsTitle {
  FH1 = 'FH1',
  FH2 = 'FH2',
  FH3 = 'FH3',
  FH4 = 'FH4',
  FM5 = 'FM5',
  FM6 = 'FM6',
  FM7 = 'FM7',
}

/** Enum that represents loyalty reward titles for Steelhead. */
export enum SteelheadLoyaltyRewardsTitle {
  FH = 'FH',
  FH2 = 'FH2',
  FH3 = 'FH3',
  FH4 = 'FH4',
  FH5 = 'FH5',
  FM2 = 'FM2',
  FM3 = 'FM3',
  FM4 = 'FM4',
  FM5 = 'FM5',
  FM6 = 'FM6',
  FM7 = 'FM7',
  Street = 'Street',
}

export interface HasPlayedRecord {
  gameTitle: string;
  hasPlayed: boolean;
  sentProfileNotification: boolean;
}
