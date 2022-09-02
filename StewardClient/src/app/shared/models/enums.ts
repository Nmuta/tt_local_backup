/** Enum for the inventory gifting options. */
export enum InventoryOption {
  UserGift = 'User Gift',
  GroupGiftByXUID = 'Group Gift [XUID]',
  GroupGiftByGamertag = 'Group Gift [Gamertag]',
}

/**
 * Enum for game title names.
 * @deprecated Use GameTitle + angular pipe
 */
export enum GameTitleName {
  FH5 = 'Forza Horizon 5',
  FM8 = 'Forza Motorsport 8',
  Street = 'Forza Street',
  FH4 = 'Forza Horizon 4',
  FM7 = 'Forza Motorsport 7',
  FH3 = 'Forza Horizon 3',
}

/**
 * Enum for game title abbreviation.
 * @deprecated Use GameTitle + angular pipe
 */
export enum GameTitleAbbreviation {
  FH5 = 'FH5',
  FM8 = 'FM', // Left as steelhead until official name announced.
  Street = 'Street',
  FH4 = 'FH4',
  FM7 = 'FM7',
  FH3 = 'FH3',
}

/**
 * Enum for game title names. UpperCamel.
 * @deprecated for keys: prefer GameTitle (lowerCamel)
 * @deprecated for display: prefer GameTitle + angular pipe
 * @see GameTitle
 */
export enum GameTitleCodeName {
  General = 'General', // TODO: this is not really a title. It should be removed and placed in its own type alias when we migrate to `GameTitle` over `GameTitleCodeName`
  FH5 = 'Woodstock',
  FM8 = 'Steelhead',
  Street = 'Gravity',
  FH4 = 'Sunrise',
  FM7 = 'Apollo',
  FH3 = 'Opus',
}

/** Enum for game title names. lowerCamel. */
export enum GameTitle {
  FH5 = 'woodstock',
  FM8 = 'steelhead',
  Street = 'gravity',
  FH4 = 'sunrise',
  FM7 = 'apollo',
  FH3 = 'opus',
}

export enum UserRole {
  None = 'none', // This value does not match the casing. It seems to be provided upstream.
  LiveOpsAdmin = 'LiveOpsAdmin',
  SupportAgentAdmin = 'SupportAgentAdmin',
  SupportAgent = 'SupportAgent',
  SupportAgentNew = 'SupportAgentNew',
  DataPipelineAdmin = 'DataPipelineAdmin',
  DataPipelineContributor = 'DataPipelineContributor',
  DataPipelineRead = 'DataPipelineRead',
  CommunityManager = 'CommunityManager',
  HorizonDesigner = 'HorizonDesigner',
  MotorsportDesigner = 'MotorsportDesigner',
  MediaTeam = 'MediaTeam',
}

export enum NotificationHubEvents {
  MarkJobRead = 'NotificationHubMarkJobRead',
  MarkJobUnread = 'NotificationHubJobUnread',
  SyncAllJobs = 'NotificationHubSyncAll',
  UpdateJobState = 'NotificationHubUpdateJobState',
}

export enum InitEndpointKeysError {
  LookupFailed,
  SelectionRemoved,
}

/** Enum for device types. */
export enum DeviceType {
  All = 'All',
  MoLive = 'MoLive',
  Steam = 'Steam',
  WindowsStore = 'WindowsStore',
  XboxOne = 'XboxOne',
  XboxCloud = 'XboxCloud',
  XboxSeriesXS = 'XboxSeriesXS',
}

/** Enum for Steward error codes. */
export enum StewardErrorCode {
  BadRequest = 'BadRequest',

  DocumentNotFound = 'DocumentNotFound',

  RequiredParameterMissing = 'RequiredParameterMissing',

  UnknownFailure = 'UnknownFailure',

  FailedToSend = 'FailedToSend',

  ConversionFailed = 'ConversionFailed',

  QueryFailed = 'QueryFailed',

  DuplicateEntry = 'DuplicateEntry',

  ServicesFailure = 'ServicesFailure',
}

/** Enum for Pegasus Projection Slots. */
export enum PegasusProjectionSlot {
  Live = 'live',

  LiveSteward = 'live-steward',
}
