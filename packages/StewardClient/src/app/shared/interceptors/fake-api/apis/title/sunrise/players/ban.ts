import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseBanArea, SunriseBanResult } from '@models/sunrise';
import { fakeBigNumber, fakeXuid } from '@interceptors/fake-api/utility';
import { toDateTime } from '@helpers/luxon';

/** Fake API for banning players. */
export class SunrisePlayersBanFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/players\/ban$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SunriseBanResult[] {
    return SunrisePlayersBanFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SunriseBanResult[] {
    return [
      {
        xuid: fakeXuid(),
        error: null,
        banDescription: {
          xuid: fakeXuid(),
          isActive: true,
          countOfTimesExtended: fakeBigNumber({ min: 0, max: 20 }),
          lastExtendedTimeUtc: toDateTime('0001-01-01T00:00:00Z'),
          lastExtendedReason: null,
          reason: 'Illegitimately obtaining the Owens McLaren',
          featureArea: SunriseBanArea.AllRequests,
          startTimeUtc: toDateTime('2020-10-22T14:53:08.869Z'),
          expireTimeUtc: toDateTime('2040-10-22T14:52:16.439Z'),
        },
      },
    ];
  }
}
