import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigInt } from '@interceptors/fake-api/utility/fake-bigint';
import { SunriseGiftHistory } from '@models/sunrise';
import { Unprocessed } from '@models/unprocessed';
import faker from 'faker';

/** Fake API for finding gift history. */
export class SunrisePlayerXuidGiftHistoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/xuid\((.+)\)\/giftHistory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(body?: unknown): Partial<Unprocessed<SunriseGiftHistory[]>> {
    return SunrisePlayerXuidGiftHistoryFakeApi.make(body as BigInt);
  }

  /** Generates a sample object */
  public static make(xuid: BigInt): Partial<Unprocessed<SunriseGiftHistory[]>> {
    return [
      {
        idType: 'Xuid',
        id: xuid,
        title: 'Sunrise',
        giftSendDateUtc: faker.date.past(),
        giftInventory: {
          credits: fakeBigInt({ min: 0, max: 10000 }),
          wheelSpins: fakeBigInt({ min: 0, max: 1000 }),
          superWheelSpins: fakeBigInt({ min: 0, max: 200 }),
          skillPoints: fakeBigInt({ min: 0, max: 1000 }),
          forzathonPoints: fakeBigInt({ min: 0, max: 1000 }),
          cars: [
            {
              itemId: fakeBigInt(),
              description: faker.random.word(),
              quantity: fakeBigInt(),
            },
          ],
          carHorns: [
            {
              itemId: fakeBigInt(),
              description: faker.random.word(),
              quantity: fakeBigInt(),
            },
          ],
          emotes: [
            {
              itemId: fakeBigInt(),
              description: faker.random.word(),
              quantity: fakeBigInt(),
            },
          ],
          vanityItems: [
            {
              itemId: fakeBigInt(),
              description: faker.random.word(),
              quantity: fakeBigInt(),
            },
          ],
          quickChatLines: [
            {
              itemId: fakeBigInt(),
              description: faker.random.word(),
              quantity: fakeBigInt(),
            },
          ],
        },
      },
    ];
  }
}
