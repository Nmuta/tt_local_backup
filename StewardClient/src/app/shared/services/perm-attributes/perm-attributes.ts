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
  CloneUgc = 'CloneUgc',
  PersistUgc = 'PersistUgc',
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

/**
 * Take a JSON key param and tries to convert it to a PermAttributeName.
 * Used with permission management tooling models.
 */
export function getPermAttributeNameFromKey(key: string): PermAttributeName {
  return (key[0].toUpperCase() + key.substring(1)) as PermAttributeName;
}
