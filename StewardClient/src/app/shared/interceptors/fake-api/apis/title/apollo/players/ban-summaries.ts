import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { ApolloBanArea } from '@models/apollo/apollo-ban-request.model';
import { ApolloBanSummary } from '@models/apollo/apollo-ban-summary.model';
import { Unprocessed } from '@models/unprocessed';
import faker from 'faker';

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
  public handle(body?: unknown): Partial<Unprocessed<ApolloBanSummary[]>> {
    return ApolloPlayersBanSummariesFakeApi.make(body as BigInt[]);
  }

  /** Generates a sample object */
  public static make(xuids: BigInt[]): Partial<Unprocessed<ApolloBanSummary[]>> {
    return xuids.map(xuid => {
      return <ApolloBanSummary>{
        banCount: BigInt(faker.random.number()),
        bannedAreas: faker.random.arrayElements(Object.values(ApolloBanArea)),
        gamertag: faker.random.word(),
        xuid: xuid,
        lastBanDescription: {
          countOfTimesExtended: faker.random.number(),
          expireTimeUtc: faker.date.future(),
          featureArea: faker.random.arrayElement(Object.values(ApolloBanArea)),
          isActive: faker.random.boolean(),
          lastExtendedReason: faker.random.words(faker.random.number({ min: 5, max: 50 })),
          lastExtendedTimeUtc: faker.date.past(),
          reason: faker.random.words(faker.random.number({ min: 5, max: 50 })),
          startTimeUtc: faker.date.past(),
          xuid: xuid,
        },
        userExists: faker.random.boolean(),
      };
    });
  }
}
