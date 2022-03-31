import { NavbarTool } from '@environments/environment';

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

/** Sets whether or not app update popup should show to users. */
export class ConfigureAppUpdatePopup {
  public static readonly type = '[Settings] Configure App Update Popup';
  constructor(public readonly show: boolean) {}
}

/** Sets endpoint key defaults if none are present in local storage.. */
export class VerifyEndpointKeyDefaults {
  public static readonly type = '[Settings] Verify Endpoint Key Defaults';
  constructor() {
    //EMPTY
  }
}

/** Sets the current Apollo endpoint key of the Steward app the client is running. */
export class SetApolloEndpointKey {
  public static readonly type = '[Settings] Set Apollo Endpoint Key';
  constructor(public readonly apolloEndpointKey: string) {}
}

/** Sets the current Sunrise endpoint key of the Steward app the client is running. */
export class SetSunriseEndpointKey {
  public static readonly type = '[Settings] Set Sunrise Endpoint Key';
  constructor(public readonly sunriseEndpointKey: string) {}
}

/** Sets the current Woodstock endpoint key of the Steward app the client is running. */
export class SetWoodstockEndpointKey {
  public static readonly type = '[Settings] Set Woodstock Endpoint Key';
  constructor(public readonly woodstockEndpointKey: string) {}
}

/** Sets the current Steelhead endpoint key of the Steward app the client is running. */
export class SetSteelheadEndpointKey {
  public static readonly type = '[Settings] Set Steelhead Endpoint Key';
  constructor(public readonly steelheadEndpointKey: string) {}
}

/** Forces re-retrieval and sync of endpoint keys. */
export class RefreshEndpointKeys {
  public static readonly type = '[Settings] Refresh Endpoint Keys';
}

/** Sets the current list of tools to show in the navbar. */
export class SetNavbarTools {
  public static readonly type = '[Settings] Set Navbar Tools';
  constructor(public readonly navbarTools: Partial<Record<NavbarTool, number>>) {}
}

export interface ThemeOptions {
  override: ThemeOverrideOptions;
  environmentWarning: ThemeEnvironmentWarningOptions;
}

/** The options when overriding theme. */
export type ThemeOverrideOptions = 'dark' | 'light' | 'match' | undefined;

/** The options for alerting about the current environment. */
export type ThemeEnvironmentWarningOptions = 'warn' | 'accent' | undefined;

/** Sets the current theme override. */
export class SetThemeOverride {
  public static readonly type = '[Settings] Set Theme Override';
  constructor(public readonly themeOverride: ThemeOverrideOptions) {}
}

/** Sets the current theme override. */
export class SetThemeEnvironmentWarning {
  public static readonly type = '[Settings] Set Environment Warning';
  constructor(public readonly themeEnvironmentWarning: ThemeEnvironmentWarningOptions) {}
}
