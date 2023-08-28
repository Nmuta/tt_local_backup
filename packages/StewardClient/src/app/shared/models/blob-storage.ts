/** Interface for a tool availability response.. */
export interface ToolsAvailability {
  allTools: boolean;
}

/** Interface for Steward PlayFab settings. */
export interface PlayFabSettings {
  woodstockMaxBuildLocks: number;
  forteMaxBuildLocks: number;

  // TODO: remove once title specific properties above are populated in Production
  maxBuildLocks: number;
}
