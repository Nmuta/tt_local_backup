import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigInt } from '@interceptors/fake-api/utility/fake-bigint';
import { SunriseGiftHistory } from '@models/sunrise';
import { Unprocessed } from '@models/unprocessed';
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
    return SunriseGroupGroupIdGiftHistoryFakeApi.make(body as BigInt);
  }

  /** Generates a sample object */
  public static make(lspId: BigInt): Partial<Unprocessed<SunriseGiftHistory[]>> {
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
                id: fakeBigInt(),
                description: faker.random.word(),
                quantity: faker.random.number(),
              }
            ],
            cars: [
              {
                id: fakeBigInt(),
                description: faker.random.word(),
                quantity: faker.random.number(),
              },
            ],
            carHorns: [
              {
                id: fakeBigInt(),
                description: faker.random.word(),
                quantity: faker.random.number(),
              },
            ],
            emotes: [
              {
                id: fakeBigInt(),
                description: faker.random.word(),
                quantity: faker.random.number(),
              },
            ],
            vanityItems: [
              {
                id: fakeBigInt(),
                description: faker.random.word(),
                quantity: faker.random.number(),
              },
            ],
            quickChatLines: [
              {
                id: fakeBigInt(),
                description: faker.random.word(),
                quantity: faker.random.number(),
              },
            ],
          }
        },
      },
    ];
  }
}
