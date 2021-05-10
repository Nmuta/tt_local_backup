import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { WoodstockBanArea, WoodstockBanResult } from '@models/woodstock';

/** Fake API for banning players. */
export class WoodstockPlayersBanFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/players\/ban$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): WoodstockBanResult[] {
    return WoodstockPlayersBanFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): WoodstockBanResult[] {
    return [
      {
        xuid: new BigNumber(189456456),
        success: true,
        banDescription: {
          xuid: new BigNumber(2533275026603041),
          isActive: true,
          countOfTimesExtended: new BigNumber(0),
          lastExtendedTimeUtc: new Date('0001-01-01T00:00:00Z'),
          lastExtendedReason: null,
          reason: 'Illegitimately obtaining the Owens McLaren',
          featureArea: WoodstockBanArea.AllRequests,
          startTimeUtc: new Date('2020-10-22T14:53:08.869Z'),
          expireTimeUtc: new Date('2040-10-22T14:52:16.439Z'),
        },
      },
    ];
  }
}
