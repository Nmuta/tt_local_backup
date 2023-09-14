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

/** Type used for Steelhead flags GET requests */
export type SteelheadUserFlags = BaseSteelheadUserFlags<VerifiedUserFlag>;

/** Type used for Steelhead flags POST requests */
export type SteelheadUserFlagsInput = BaseSteelheadUserFlags<boolean>;
