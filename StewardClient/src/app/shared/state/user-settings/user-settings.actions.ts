/** Sets the Fake API to on or off. Only available in non-prod environments. */
export class SetFakeApi {
  public static readonly type = '[Settings] Toggle Fake API';
  constructor(public readonly enabled: boolean) {}
}

/** Sets the Staging API to on or off. */
export class SetStagingApi {
  public static readonly type = '[Settings] Toggle Staging API';
  constructor(public readonly enabled: boolean) {}
}

/** Sets the current version of the Steward app the client is running. */
export class SetAppVersion {
  public static readonly type = '[Settings] Set App Version';
  constructor(public readonly version: string) {}
}
