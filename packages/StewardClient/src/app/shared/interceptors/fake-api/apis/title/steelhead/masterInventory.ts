import { environment } from '@environments/environment';
import faker from '@faker-js/faker';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SteelheadMasterInventory } from '@models/steelhead';
import BigNumber from 'bignumber.js';

/** Fake API for getting master inventory. */
export class SteelheadMasterInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/masterInventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SteelheadMasterInventory {
    return SteelheadMasterInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SteelheadMasterInventory {
    return {
      creditRewards: [
        {
          id: new BigNumber(faker.datatype.number()),
          description: faker.datatype.string(),
          quantity: faker.datatype.number(),
          itemType: faker.datatype.string(),
          error: null,
        },
      ],
      cars: [
        {
          id: new BigNumber(faker.datatype.number()),
          description: faker.datatype.string(),
          quantity: faker.datatype.number(),
          itemType: faker.datatype.string(),
          error: null,
        },
      ],
      vanityItems: [
        {
          id: new BigNumber(faker.datatype.number()),
          description: faker.datatype.string(),
          quantity: faker.datatype.number(),
          itemType: faker.datatype.string(),
          error: null,
        },
      ],
      driverSuits: [
        {
          id: new BigNumber(faker.datatype.number()),
          description: faker.datatype.string(),
          quantity: faker.datatype.number(),
          itemType: faker.datatype.string(),
          error: null,
        },
      ],
    };
  }
}
