import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { SunriseMasterInventory } from '@models/sunrise';
import BigNumber from 'bignumber.js';
import faker from 'faker';

/** Fake API for getting master inventory. */
export class SunriseMasterInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/masterInventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SunriseMasterInventory {
    return SunriseMasterInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SunriseMasterInventory {
    function makeFakeItems(count: number): MasterInventoryItem[] {
      return Array(faker.datatype.number({ min: 5, max: count }))
        .fill(0)
        .map(() => {
          return {
            id: fakeBigNumber(),
            quantity: 0,
            description: faker.random.words(5),
            itemType: undefined,
            error: undefined,
          };
        });
    }

    return {
      creditRewards: [
        {
          id: new BigNumber(-1),
          quantity: 0,
          description: faker.random.word(),
          itemType: undefined,
          error: undefined,
        },
      ],
      cars: makeFakeItems(50),
      carHorns: makeFakeItems(50),
      vanityItems: makeFakeItems(50),
      quickChatLines: makeFakeItems(50),
      emotes: makeFakeItems(50),
    };
  }
}
