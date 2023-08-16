/** List of all perm attributes. */
export enum PermAttributeName {
  TitleAccess = 'TitleAccess',
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
  GiftPlayer = 'GiftPlayer',
  HideUgc = 'HideUgc',
  BulkGenerateSharecode = 'BulkGenerateSharecode',
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
  CreateAuctions = 'CreateAuctions',
  ManagePlayFabBuildLocks = 'ManagePlayFabBuildLocks',
  ManagePlayFabSettings = 'ManagePlayFabSettings',
  GrantPaidEntitlements = 'GrantPaidEntitlements',
  SetDriverLevel = 'SetDriverLevel',
  ManageStewardTeam = 'ManageStewardTeam',
  ManagePlayerInventory = 'ManagePlayerInventory',
  AllowedToExceedCreditLimit = 'AllowedToExceedCreditLimit',
  UpdateSafetyRating = 'UpdateSafetyRating',
  OverrideSkillRating = 'OverrideSkillRating',
  EditUgc = 'EditUgc',
  UpdateLspTask = 'UpdateLspTask',
  UpdateUgcProfile = 'UpdateUgcProfile',
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
