import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SteelheadMasterInventory } from '@models/steelhead';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from 'faker';

/** Fake API for steelhead player inventory. */
export class SteelheadPlayerXuidInventoryFakeApi extends FakeApiBase {
  private xuid: BigNumber;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/player\/xuid\((.+)\)\/inventory$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.xuid = new BigNumber(match[1]);
    return true;
  }

  /** Produces a sample API response. */
  public handle(): SteelheadMasterInventory {
    return SteelheadPlayerXuidInventoryFakeApi.make(this.xuid);
  }

  /** Generates a sample object */
  public static make(_xuid: BigNumber): SteelheadMasterInventory {
    function makeFakeItems(count: number): MasterInventoryItem[] {
      return Array(faker.datatype.number(count))
        .fill(0)
        .map(() => {
          return {
            id: fakeBigNumber(),
            quantity: faker.datatype.number(1_000),
            description: faker.lorem.sentences(2),
            itemType: undefined,
          };
        });
    }

    return {
      creditRewards: [
        {
          id: new BigNumber(-1),
          description: 'Credits',
          quantity: faker.datatype.number(100_000_000),
          itemType: undefined,
        },
      ],
      cars: makeFakeItems(200),
      vanityItems: makeFakeItems(200),
    };
  }
}
