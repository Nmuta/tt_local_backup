/** Enum for the inventory gifting options. */
export enum InventoryOption {
  UserGift = 'User Gift',
  GroupGiftByXUID = 'Group Gift [XUID]',
  GroupGiftByGamertag = 'Group Gift [Gamertag]',
}

/** Enum for game title names. */
export enum GameTitleName {
  FH5 = 'Forza Horizon 5',
  FM8 = 'Forza Motorsport 8',
  Street = 'Forza Street',
  FH4 = 'Forza Horizon 4',
  FM7 = 'Forza Motorsport 7',
  FH3 = 'Forza Horizon 3',
}

/**
 * Enum for game title names. UpperCamel.
 * @deprecated for keys: prefer GameTitle (lowerCamel)
 * @deprecated for display: prefer GameTitle + angular pipe
 * @see GameTitle
 */
export enum GameTitleCodeName {
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
  LiveOpsAdmin = 'LiveOpsAdmin',
  SupportAgentAdmin = 'SupportAgentAdmin',
  SupportAgent = 'SupportAgent',
  SupportAgentNew = 'SupportAgentNew',
  DataPipelineAdmin = 'DataPipelineAdmin',
  DataPipelineContributor = 'DataPipelineContributor',
  DataPipelineRead = 'DataPipelineRead',
  CommunityManager = 'CommunityManager',
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
