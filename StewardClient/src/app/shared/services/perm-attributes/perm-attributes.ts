/** List of all perm attributes. */
export enum PermAttributeName {
  AddLocalizedString = 'AddLocalizedString',
  AddProfileNote = 'AddProfileNote',
  AdminFeature = 'AdminFeature',
  BanConsole = 'BanConsole',
  BanPlayer = 'BanPlayer',
  CreateUserGroup = 'CreateUserGroup',
  DeleteAuction = 'DeleteAuction',
  DeleteBan = 'DeleteBan',
  DeleteLeaderboardScores = 'DeleteLeaderboardScores',
  FeatureUGC = 'FeatureUGC',
  GroupGifting = 'GroupGifting',
  GroupLiveryGifting = 'GroupLiveryGifting',
  GroupMessaging = 'GroupMessaging',
  HideUGC = 'HideUGC',
  OverrideCMS = 'OverrideCMS',
  PlayerGifitng = 'PlayerGifitng',
  PlayerGifting = 'PlayerGifting',
  PlayerLiveryGifting = 'PlayerLiveryGifting',
  PlayerMessaging = 'PlayerMessaging',
  SendLoyaltyRewards = 'SendLoyaltyRewards',
  ServicesFeature = 'ServicesFeature',
  SetReportWeight = 'SetReportWeight',
  SetUGCGeoFlag = 'SetUGCGeoFlag',
  UpdateAuctionBlocklist = 'UpdateAuctionBlocklist',
  UpdateObligationPipeline = 'UpdateObligationPipeline',
  UpdateProfile = 'UpdateProfile',
  UpdateUserGroup = 'UpdateUserGroup',
}

/** Full perm attribute details. */
export interface PermAttribute {
  attribute: PermAttributeName;
  title: string;
  environment: string;
}
