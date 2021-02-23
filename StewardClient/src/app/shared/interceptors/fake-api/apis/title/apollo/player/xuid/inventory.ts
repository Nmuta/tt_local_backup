import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { ApolloMasterInventory } from '@models/apollo';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { fakeBigInt } from '@interceptors/fake-api/utility';
import faker from 'faker';

/** Fake API for apollo player inventory. */
export class ApolloPlayerXuidInventoryFakeApi extends FakeApiBase {
  private xuid: bigint;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/player\/xuid\((.+)\)\/inventory$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.xuid = BigInt(match[1]);
    return true;
  }

  /** Produces a sample API response. */
  public handle(): ApolloMasterInventory {
    return ApolloPlayerXuidInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): ApolloMasterInventory {
    function makeFakeItems(count: number): MasterInventoryItem[] {
      return Array(faker.random.number(count))
        .fill(0)
        .map(() => {
          return {
            id: fakeBigInt(),
            quantity: faker.random.number(1_000),
            description: faker.lorem.sentences(2),
            itemType: undefined,
          };
        });
    }

    return {
      creditRewards: [
        {
          id: BigInt(-1),
          description: 'Credits',
          quantity: faker.random.number(100_000_000),
          itemType: undefined,
        },
      ],
      cars: makeFakeItems(200),
      vanityItems: makeFakeItems(200),
    };
  }
}
