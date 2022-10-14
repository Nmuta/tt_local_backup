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
  FM8 = 'Forza Motorsport',
  FH5 = 'Forza Horizon 5',
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
  FM8 = 'FM',
  FH5 = 'FH5',
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
  FM8 = 'steelhead',
  FH5 = 'woodstock',
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
  V2Role = 'V2Role', // REMOVE - this is just for testing
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

/** Enum for notification types. */
export enum NotificationType {
  CommunityMessage = 'CommunityMessage',
  PatchNotes = 'PatchNotes',
}

/** Enum for localization categories. */
export enum LocalizationCategory {
  MOTD = 'MOTD', //Casing matches that of Service Enum 'LocalizationCategory'. Do not change.
  PatchNotes = 'PatchNotes',
  Notifications = 'Notifications',
  Gifts = 'Gifts',
}

/** Enum for localization categories language + locales. */
export enum SupportedLocalizationLanguageCodes {
  cs_CZ = 'cs-CZ',
  de_DE = 'de-DE',
  en_US = 'en-US',
  es_ES = 'es-ES',
  es_MX = 'es-MX',
  fi_FI = 'fi-FI',
  fr_FR = 'fr-FR',
  hu_HU = 'hu-HU',
  it_IT = 'it-IT',
  ja_JP = 'ja-JP',
  ko_KR = 'ko-KR',
  nb_NO = 'nb-NO',
  nl_NL = 'nl-NL',
  pl_PL = 'pl-PL',
  pt_BR = 'bt-BR',
  ru_RU = 'ru-RU',
  sv_SE = 'sv-SE',
  tr_TR = 'tr-TR',
  zh_CN = 'zh-CN',
  zh_TW = 'zh-TW',
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
