import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SteelheadBanArea, SteelheadBanSummary } from '@models/steelhead';
import faker from '@faker-js/faker';
import { toDateTime } from '@helpers/luxon';

/** Fake API for banning players. */
export class SteelheadPlayersBanSummariesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/players\/banSummaries$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(body?: unknown): SteelheadBanSummary[] {
    return SteelheadPlayersBanSummariesFakeApi.make(body as BigNumber[]);
  }

  /** Generates a sample object */
  public static make(xuids: BigNumber[]): SteelheadBanSummary[] {
    return xuids.map(xuid => {
      return <SteelheadBanSummary>{
        banCount: new BigNumber(faker.datatype.number()),
        bannedAreas: faker.random.arrayElements(Object.values(SteelheadBanArea)),
        gamertag: faker.random.word(),
        xuid: xuid,
        lastBanDescription: {
          countOfTimesExtended: new BigNumber(faker.datatype.number()),
          expireTimeUtc: toDateTime(faker.date.future()),
          featureArea: faker.random.arrayElement(Object.values(SteelheadBanArea)),
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
