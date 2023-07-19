import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber, fakeXuid } from '@interceptors/fake-api/utility';
import { Entitlement, EntitlementType } from '@models/entitlement';
import faker from '@faker-js/faker';

/** Fake API for getting kusto player entitlements. */
export class KustoGetPlayerEntitlements extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/kusto\/player\/(\d+)\/entitlements$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Entitlement[] {
    return KustoGetPlayerEntitlements.make();
  }

  /** Generates a sample object */
  public static make(): Entitlement[] {
    return new Array(faker.datatype.number({ min: 2, max: 10 })).fill(undefined).map(() => {
      return {
        type: EntitlementType.Purchased,
        dateId: faker.datatype.number(),
        xuid: fakeXuid(),
        orderId: faker.random.word(),
        purchasePriceUSDAmount: faker.datatype.number(),
        isPaidTransaction: faker.datatype.boolean(),
        productId: faker.random.word(),
        productTypeName: faker.random.word(),
        titleId: fakeBigNumber(),
      } as Entitlement;
    });
  }
}
