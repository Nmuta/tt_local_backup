import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { OpusMasterInventory } from '@models/opus';

/** Fake API for opus player inventory. */
export class OpusPlayerXuidInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    if (this.request.method.toUpperCase() !== 'GET') {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/opus\/player\/xuid\((.+)\)\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): OpusMasterInventory {
    return OpusPlayerXuidInventoryFakeApi.make(null);
  }

  /** Generates a sample object */
  public static make(_xuid: BigNumber): OpusMasterInventory {
    return {
      creditRewards: [
        {
          id: new BigNumber(-1),
          description: 'Credits',
          quantity: faker.random.number(400_000_000),
          itemType: undefined,
        },
      ],
      cars: Array(faker.random.number(200))
        .fill(0)
        .map(() => {
          return {
            id: fakeBigNumber(),
            quantity: 1,
            description: faker.random.words(3),
            itemType: undefined,
          };
        }),
    };
  }
}
