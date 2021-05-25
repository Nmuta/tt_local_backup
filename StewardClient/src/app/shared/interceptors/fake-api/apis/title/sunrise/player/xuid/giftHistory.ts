import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility/fake-bigint';
import { SunriseGiftHistory } from '@models/sunrise';
import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
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
  public handle(body?: unknown): SunriseGiftHistory[] {
    return SunrisePlayerXuidGiftHistoryFakeApi.make(body as BigNumber);
  }

  /** Generates a sample object */
  public static make(xuid: BigNumber): SunriseGiftHistory[] {
    return [
      {
        idType: GiftIdentityAntecedent.Xuid,
        id: xuid,
        title: 'sunrise',
        giftSendDateUtc: faker.date.past(),
        requesterObjectId: faker.datatype.uuid(),
        giftInventory: {
          giftReason: faker.random.word(),
          inventory: {
            creditRewards: [
              {
                id: fakeBigNumber(),
                itemType: faker.random.word(),
                description: faker.random.words(5),
                quantity: faker.datatype.number(),
              },
            ],
            cars: [
              {
                id: fakeBigNumber(),
                itemType: faker.random.word(),
                description: faker.random.words(5),
                quantity: faker.datatype.number(),
              },
            ],
            carHorns: [
              {
                id: fakeBigNumber(),
                itemType: faker.random.word(),
                description: faker.random.words(5),
                quantity: faker.datatype.number(),
              },
            ],
            emotes: [
              {
                id: fakeBigNumber(),
                itemType: faker.random.word(),
                description: faker.random.words(5),
                quantity: faker.datatype.number(),
              },
            ],
            vanityItems: [
              {
                id: fakeBigNumber(),
                itemType: faker.random.word(),
                description: faker.random.words(5),
                quantity: faker.datatype.number(),
              },
            ],
            quickChatLines: [
              {
                id: fakeBigNumber(),
                itemType: faker.random.word(),
                description: faker.random.words(5),
                quantity: faker.datatype.number(),
              },
            ],
          },
        },
      },
    ];
  }
}
