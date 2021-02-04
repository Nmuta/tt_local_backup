import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
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
          credits: BigInt(faker.random.number({ min: 0, max: 10000 })),
          wheelSpins: BigInt(faker.random.number({ min: 0, max: 1000 })),
          superWheelSpins: BigInt(faker.random.number({ min: 0, max: 200 })),
          skillPoints: BigInt(faker.random.number({ min: 0, max: 1000 })),
          forzathonPoints: BigInt(faker.random.number({ min: 0, max: 1000 })),
          cars: [
            {
              itemId: BigInt(faker.random.number()),
              description: faker.random.word(),
              quantity: BigInt(faker.random.number()),
            },
          ],
          carHorns: [
            {
              itemId: BigInt(faker.random.number()),
              description: faker.random.word(),
              quantity: BigInt(faker.random.number()),
            },
          ],
          emotes: [
            {
              itemId: BigInt(faker.random.number()),
              description: faker.random.word(),
              quantity: BigInt(faker.random.number()),
            },
          ],
          vanityItems: [
            {
              itemId: BigInt(faker.random.number()),
              description: faker.random.word(),
              quantity: BigInt(faker.random.number()),
            },
          ],
          quickChatLines: [
            {
              itemId: BigInt(faker.random.number()),
              description: faker.random.word(),
              quantity: BigInt(faker.random.number()),
            },
          ],
        },
      },
    ];
  }
}
