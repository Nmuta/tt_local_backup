import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility/fake-bigint';
import { ApolloGiftHistory } from '@models/apollo';
import { Unprocessed } from '@models/unprocessed';
import BigNumber from 'bignumber.js';
import faker from 'faker';

/** Fake API for finding gift history. */
export class ApolloPlayerXuidGiftHistoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/player\/xuid\((.+)\)\/giftHistory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(body?: unknown): Partial<Unprocessed<ApolloGiftHistory[]>> {
    return ApolloPlayerXuidGiftHistoryFakeApi.make(body as BigNumber);
  }

  /** Generates a sample object */
  public static make(xuid: BigNumber): Partial<Unprocessed<ApolloGiftHistory[]>> {
    return [
      {
        idType: 'Xuid',
        id: xuid,
        title: 'Apollo',
        giftSendDateUtc: faker.date.past(),
        giftInventory: {
          giftReason: faker.random.word(),
          inventory: {
            creditRewards: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.random.number(),
              },
            ],
            cars: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.random.number(),
              },
            ],
            vanityItems: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.random.number(),
              },
            ],
          },
        },
      },
    ];
  }
}
