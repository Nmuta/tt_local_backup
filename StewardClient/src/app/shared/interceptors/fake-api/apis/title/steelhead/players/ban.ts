import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SteelheadBanArea, SteelheadBanResult } from '@models/steelhead';
import { faker } from '@interceptors/fake-api/utility';

/** Fake API for banning players. */
export class SteelheadPlayersBanFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/players\/ban$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SteelheadBanResult[] {
    return SteelheadPlayersBanFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SteelheadBanResult[] {
    return [
      {
        xuid: new BigNumber(189456456),
        success: true,
        banDescription: {
          xuid: new BigNumber(2533275026603041),
          isActive: true,
          countOfTimesExtended: new BigNumber(0),
          lastExtendedTimeUtc: faker.date.past(),
          lastExtendedReason: null,
          reason: 'Illegitimately obtaining the Owens McLaren',
          featureArea: SteelheadBanArea.AllRequests,
          startTimeUtc: faker.date.past(),
          expireTimeUtc: faker.date.future(),
        },
      },
    ];
  }
}
