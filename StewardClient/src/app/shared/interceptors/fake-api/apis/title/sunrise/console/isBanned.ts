import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';

/** Fake API for finding User Flags. */
export class SunriseConsoleIsBannedFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(
      environment.stewardApiUrl
    );
    if (!targetingStewardApi) {
      return false;
    }

    const isPut = this.request.method.toLowerCase() === 'put';
    if (!isPut) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v2\/title\/sunrise\/console\/consoleId\((\d+)\)\/isBanned\((true|false)\)/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): object {
    return [
      {
        consoleId: '17942385017267761210',
        isBanned: false,
        isBannable: true,
        deviceType: 'WindowsOneCore',
        clientVersion: '432815',
      },
      {
        consoleId: '17942385017267761211',
        isBanned: true,
        isBannable: true,
        deviceType: 'WindowsOneCore',
        clientVersion: '432815',
      },
      {
        consoleId: '17942385017267761212',
        isBanned: false,
        isBannable: false,
        deviceType: 'WindowsOneCore',
        clientVersion: '432815',
      },
      {
        consoleId: '17942385017267761213',
        isBanned: true,
        isBannable: false,
        deviceType: 'WindowsOneCore',
        clientVersion: '432815',
      },
    ];
  }
}
