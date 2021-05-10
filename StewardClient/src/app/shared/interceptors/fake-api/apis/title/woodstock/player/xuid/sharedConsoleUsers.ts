import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { WoodstockSharedConsoleUser } from '@models/woodstock';

/** Fake API for finding User Flags. */
export class WoodstockPlayerXuidConsoleSharedConsoleUsersFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/player\/xuid\((\d+)\)\/sharedConsoleUsers$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): WoodstockSharedConsoleUser[] {
    return WoodstockPlayerXuidConsoleSharedConsoleUsersFakeApi.makeMany();
  }

  /** Creates a sample response. */
  public static makeMany(): WoodstockSharedConsoleUser[] {
    return [
      {
        sharedConsoleId: new BigNumber(17942385017267761210),
        xuid: new BigNumber(2535460485267489),
        gamertag: 'temporary1021',
        everBanned: false,
      },
    ];
  }
}
