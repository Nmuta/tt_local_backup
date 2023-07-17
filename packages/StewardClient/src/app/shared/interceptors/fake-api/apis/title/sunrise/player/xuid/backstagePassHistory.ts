import { environment } from '@environments/environment';
import { toDateTime } from '@helpers/luxon';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { BackstagePassHistory } from '@models/backstage-pass-history';
import faker from '@faker-js/faker';

/** Fake API for finding backstage pass history events for a XUID. */
export class SunrisePlayerXuidBackstagePassHistoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/xuid\((\d+)\)\/backstagePassUpdates$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): BackstagePassHistory[] {
    return SunrisePlayerXuidBackstagePassHistoryFakeApi.makeMany();
  }

  /** Creates a sample response. */
  public static makeMany(): BackstagePassHistory[] {
    return new Array(faker.datatype.number({ min: 5, max: 50 })).fill(undefined).map(
      () =>
        <BackstagePassHistory>{
          createdAtUtc: toDateTime(faker.date.past()),
          uniqueId: faker.datatype.uuid(),
          transactionType: faker.random.word(),
          backstagePassAmount: fakeBigNumber({ min: 0, max: 100 }),
        },
    );
  }
}
