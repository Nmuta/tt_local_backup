/** The /v2/title/steelhead/{xuid}/flags model */
interface BaseSteelheadUserFlags<T extends VerifiedUserFlag | boolean> {
  isGamecoreVip: T;
  isGamecoreUltimateVip: T;
  isSteamVip: T;
  isSteamUltimateVip: T;
  isTurn10Employee: T;
  isEarlyAccess: T;
  isUnderReview: T;
  isRaceMarshall: T;
  isCommunityManager: T;
  isContentCreator: T;
}

interface VerifiedUserFlag {
  isMember: boolean;
  hasConflict: boolean;
}

export type SteelheadUserFlags = BaseSteelheadUserFlags<VerifiedUserFlag>;
export type SteelheadUserFlagsInput = BaseSteelheadUserFlags<boolean>;
