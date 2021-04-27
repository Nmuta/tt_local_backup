import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility/fake-bigint';
import { SunriseGiftHistory } from '@models/sunrise';
import { Unprocessed } from '@models/unprocessed';
import BigNumber from 'bignumber.js';
import faker from 'faker';

/** Fake API for finding gift history. */
export class SunriseGroupGroupIdGiftHistoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/group\/groupId\((.+)\)\/giftHistory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(body?: unknown): Partial<Unprocessed<SunriseGiftHistory[]>> {
    return SunriseGroupGroupIdGiftHistoryFakeApi.make(body as BigNumber);
  }

  /** Generates a sample object */
  public static make(lspId: BigNumber): Partial<Unprocessed<SunriseGiftHistory[]>> {
    return [
      {
        idType: 'LspGroupId',
        id: lspId,
        title: 'Sunrise',
        giftSendDateUtc: faker.date.past(),
        giftInventory: {
          giftReason: faker.random.word(),
          inventory: {
            creditRewards: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.datatype.number(),
              },
            ],
            cars: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.datatype.number(),
              },
            ],
            carHorns: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.datatype.number(),
              },
            ],
            emotes: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.datatype.number(),
              },
            ],
            vanityItems: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.datatype.number(),
              },
            ],
            quickChatLines: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.datatype.number(),
              },
            ],
          },
        },
      },
    ];
  }
}
