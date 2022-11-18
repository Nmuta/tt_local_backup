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
  FeatureUgc = 'FeatureUgc',
  GiftGroup = 'GiftGroup',
  GiftGroupLivery = 'GiftGroupLivery',
  GiftPlayer = 'GiftPlayer',
  GiftPlayerLivery = 'GiftPlayerLivery',
  HideUgc = 'HideUgc',
  MessageGroup = 'MessageGroup',
  MessagePlayer = 'MessagePlayer',
  OverrideCms = 'OverrideCms',
  ReportUgc = 'ReportUgc',
  RemoveAllUsersFromGroup = 'RemoveAllUsersFromGroup',
  SendLoyaltyRewards = 'SendLoyaltyRewards',
  ServicesFeature = 'ServicesFeature',
  SetReportWeight = 'SetReportWeight',
  SetUgcGeoFlag = 'SetUgcGeoFlag',
  UnhideUgc = 'UnhideUgc',
  UpdateAuctionBlocklist = 'UpdateAuctionBlocklist',
  UpdateObligationPipeline = 'UpdateObligationPipeline',
  UpdateProfile = 'UpdateProfile',
  UpdateUserGroup = 'UpdateUserGroup',
  UpdateUserFlags = 'UpdateUserFlags',
  UpdateMessageOfTheDay = 'UpdateMessageOfTheDay',
  UpdateWelcomeCenterTiles = 'UpdateWelcomeCenterTiles',
}

/** Full perm attribute details. */
export interface PermAttribute {
  attribute: PermAttributeName;
  title: string;
  environment: string;
}
