import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { AuctionBlocklistEntry } from '@models/auction-blocklist-entry';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { DateTime } from 'luxon';

/** Fake API for finding sunrise groups. */
export class SunriseAuctionBlocklistFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/auctions\/blocklist$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): AuctionBlocklistEntry[] {
    return SunriseAuctionBlocklistFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): AuctionBlocklistEntry[] {
    return [
      {
        carId: fakeBigNumber(),
        description: faker.datatype.string(),
        doesExpire: faker.datatype.boolean(),
        expireDateUtc: DateTime.fromJSDate(faker.datatype.datetime()),
      },
      {
        carId: fakeBigNumber(),
        description: faker.datatype.string(),
        doesExpire: faker.datatype.boolean(),
        expireDateUtc: DateTime.fromJSDate(faker.datatype.datetime()),
      },
      {
        carId: fakeBigNumber(),
        description: faker.datatype.string(),
        doesExpire: faker.datatype.boolean(),
        expireDateUtc: DateTime.fromJSDate(faker.datatype.datetime()),
      },
    ];
  }
}
