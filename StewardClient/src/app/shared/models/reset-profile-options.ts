/** Model for selectable options when resetting player profile */
export interface ResetProfileOptions {
  resetCarProgressData: boolean;
  resetLeaderboardsData: boolean;
  resetRaceRankingData: boolean;
  resetStatsData: boolean;
  resetTrueSkillData: boolean;
  resetUserInventoryData: boolean;
  resetUserSafetyRatingData: boolean;
  softDeleteInventory: boolean;
}
