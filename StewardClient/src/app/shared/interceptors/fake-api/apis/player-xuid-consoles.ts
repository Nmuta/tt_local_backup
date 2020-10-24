import { environment } from "@environments/environment";

import { FakeApiBase } from "./fake-api-base";

/** Fake API for finding User Flags. */
export class PlayerXuidConsolesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) { return false };

    const url = new URL(this.request.url);
    const regex = /sunrise\/player\/xuid\((\d+)\)\/consoles/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): object {
    return [
      {
        consoleId: 17942385017267761210,
        isBanned: false,
        isBannable: true,
        deviceType: 'WindowsOneCore',
        clientVersion: '432815',
      },
    ];
  }
}