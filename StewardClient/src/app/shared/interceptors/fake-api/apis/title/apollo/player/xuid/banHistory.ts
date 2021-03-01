import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GameTitleCodeName } from '@models/enums';
import { ApolloBanArea, ApolloBanHistoryEntry } from '@models/apollo';
import { Unprocessed } from '@models/unprocessed';
import faker from 'faker';
import { fakeBigInt } from '@interceptors/fake-api/utility';

/** Fake API for finding User Flags. */
export class ApolloPlayerXuidBanHistoryFakeApi extends FakeApiBase {
  private xuid: bigint;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/player\/xuid\((\d+)\)\/banHistory$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.xuid = BigInt(match[1]);
    return true;
  }

  /** Produces a sample API response. */
  public handle(): ApolloBanHistoryEntry[] {
    return ApolloPlayerXuidBanHistoryFakeApi.make(this.xuid);
  }

  /** Creates a sample object. */
  public static make(xuid: bigint, min: number = 0): ApolloBanHistoryEntry[] {
    return new Array(faker.random.number({ min: min, max: 5 })).fill(undefined).map(
      () =>
        <ApolloBanHistoryEntry>{
          banParameters: faker.lorem.paragraph(),
          expireTimeUtc: faker.date.future(),
          startTimeUtc: faker.date.past(),
          featureArea: faker.random.arrayElement(Object.values(ApolloBanArea)),
          isActive: faker.random.boolean(),
          reason: faker.lorem.sentence(),
          requestingAgent: faker.internet.email(),
          title: 'apollo',
          xuid: xuid,
          countOfTimesExtended: fakeBigInt(),
          lastExtendedTimeUtc: faker.date.recent(),

        },
    );
  }
}
