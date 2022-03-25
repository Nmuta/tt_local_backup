import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { ApolloPlayerInventory } from '@models/apollo';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import faker from '@faker-js/faker';
import { PlayerInventoryItem } from '@models/player-inventory-item';
import { toDateTime } from '@helpers/luxon';

/** Fake API for apollo player inventory. */
export class ApolloPlayerXuidInventoryFakeApi extends FakeApiBase {
  private xuid: BigNumber;

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
    this.xuid = new BigNumber(match[1]);
    return true;
  }

  /** Produces a sample API response. */
  public handle(): ApolloPlayerInventory {
    return ApolloPlayerXuidInventoryFakeApi.make(this.xuid);
  }

  /** Generates a sample object */
  public static make(_xuid: BigNumber): ApolloPlayerInventory {
    function makeFakeItems(count: number): PlayerInventoryItem[] {
      return Array(faker.datatype.number(count))
        .fill(0)
        .map(() => {
          return {
            id: fakeBigNumber(),
            quantity: faker.datatype.number(1_000),
            description: faker.lorem.sentences(2),
            itemType: undefined,
            error: undefined,
            acquiredUtc: toDateTime(faker.date.past()),
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
          error: undefined,
        },
      ],
      cars: makeFakeItems(200),
      vanityItems: makeFakeItems(200),
    };
  }
}
