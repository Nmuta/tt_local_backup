import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseBanResult } from '@models/sunrise';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for banning players. */
export class SunrisePlayersBanFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v1\/title\/sunrise\/players\/ban/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<SunriseBanResult[]>> {
    return SunrisePlayersBanFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<SunriseBanResult[]>> {
    return [
      {
        xuid: 189456456,
        success: true,
        BanDescription: 
        {
          xuid: 2533275026603041,
          isActive: true,
          countOfTimesExtended: 0,
          lastExtendedTimeUtc: '0001-01-01T00:00:00Z',
          lastExtendedReason: null,
          reason: 'Illegitimately obtaining the Owens McLaren',
          featureArea: 'AllRequests',
          startTimeUtc: '2020-10-22T14:53:08.869Z',
          expireTimeUtc: '2040-10-22T14:52:16.439Z',
        }
      },
    ];
  }
}
