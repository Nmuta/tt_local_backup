import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseBanArea } from '@models/sunrise/sunrise-ban-request.model';
import { SunriseBanSummary } from '@models/sunrise/sunrise-ban-summary.model';
import { Unprocessed } from '@models/unprocessed';
import faker from 'faker';

/** Fake API for banning players. */
export class SunrisePlayersBanSummariesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v1\/title\/sunrise\/players\/banSummaries/i;
    debugger;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(body?: unknown): Partial<Unprocessed<SunriseBanSummary[]>> {
    return SunrisePlayersBanSummariesFakeApi.make(body as BigInt[]);
  }

  /** Generates a sample object */
  public static make(xuids: BigInt[]): Partial<Unprocessed<SunriseBanSummary[]>> {
    return xuids.map(xuid => {
      return <SunriseBanSummary>{
        banCount: BigInt(faker.random.number()),
        bannedAreas: faker.random.arrayElements(Object.values(SunriseBanArea)),
        gamertag: faker.random.word(),
        xuid: xuid,
        lastBanDescription: {
          countOfTimesExtended: faker.random.number(),
          expireTimeUtc: faker.date.future(),
          featureArea: faker.random.arrayElement(Object.values(SunriseBanArea)),
          isActive: faker.random.boolean(),
          lastExtendedReason: faker.random.words(faker.random.number({min: 5, max: 50})),
          lastExtendedTimeUtc: faker.date.past(),
          reason: faker.random.words(faker.random.number({min: 5, max: 50})),
          startTimeUtc: faker.date.past(),
          xuid: xuid,
        },
        userExists: faker.random.boolean(),
      }
    });
  }
}
