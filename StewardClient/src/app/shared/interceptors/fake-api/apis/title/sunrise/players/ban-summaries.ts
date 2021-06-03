import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { ZERO } from '@helpers/bignumbers';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseBanSummary, SunriseBanArea } from '@models/sunrise';
import faker from 'faker';
import { toDateTime } from '@helpers/luxon';

/** Fake API for banning players. */
export class SunrisePlayersBanSummariesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/players\/banSummaries$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(body?: unknown): SunriseBanSummary[] {
    return SunrisePlayersBanSummariesFakeApi.make(body as BigNumber[]);
  }

  /** Generates a sample object */
  public static make(xuids: BigNumber[]): SunriseBanSummary[] {
    return xuids.map(xuid => {
      return <SunriseBanSummary>{
        banCount: faker.datatype.boolean() ? ZERO : new BigNumber(faker.datatype.number()),
        bannedAreas: faker.random.arrayElements(Object.values(SunriseBanArea)),
        gamertag: faker.random.word(),
        xuid: xuid,
        lastBanDescription: {
          countOfTimesExtended: new BigNumber(faker.datatype.number()),
          expireTimeUtc: toDateTime(faker.date.future()),
          featureArea: faker.random.arrayElement(Object.values(SunriseBanArea)),
          isActive: faker.datatype.boolean(),
          lastExtendedReason: faker.random.words(faker.datatype.number({ min: 5, max: 50 })),
          lastExtendedTimeUtc: toDateTime(faker.date.past()),
          reason: faker.random.words(faker.datatype.number({ min: 5, max: 50 })),
          startTimeUtc: toDateTime(faker.date.past()),
          xuid: xuid,
        },
        userExists: faker.datatype.boolean(),
      };
    });
  }
}
