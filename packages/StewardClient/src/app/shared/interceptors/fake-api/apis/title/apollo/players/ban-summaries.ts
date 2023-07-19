import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { ApolloBanArea, ApolloBanSummary } from '@models/apollo';
import faker from '@faker-js/faker';
import { toDateTime } from '@helpers/luxon';

/** Fake API for banning players. */
export class ApolloPlayersBanSummariesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/players\/banSummaries$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(body?: unknown): ApolloBanSummary[] {
    return ApolloPlayersBanSummariesFakeApi.make(body as BigNumber[]);
  }

  /** Generates a sample object */
  public static make(xuids: BigNumber[]): ApolloBanSummary[] {
    return xuids.map(xuid => {
      return <ApolloBanSummary>{
        banCount: new BigNumber(faker.datatype.number()),
        bannedAreas: faker.random.arrayElements(Object.values(ApolloBanArea)),
        gamertag: faker.random.word(),
        xuid: xuid,
        lastBanDescription: {
          countOfTimesExtended: new BigNumber(faker.datatype.number()),
          expireTimeUtc: toDateTime(faker.date.future()),
          featureArea: faker.random.arrayElement(Object.values(ApolloBanArea)),
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
