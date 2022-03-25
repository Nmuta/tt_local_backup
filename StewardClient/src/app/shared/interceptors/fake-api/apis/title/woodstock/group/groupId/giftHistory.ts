import { environment } from '@environments/environment';
import { toDateTime } from '@helpers/luxon';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility/fake-bigint';
import { WoodstockGiftHistory } from '@models/woodstock';
import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import faker from '@faker-js/faker';

/** Fake API for finding gift history. */
export class WoodstockGroupGroupIdGiftHistoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/group\/groupId\((.+)\)\/giftHistory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(body?: unknown): WoodstockGiftHistory[] {
    return WoodstockGroupGroupIdGiftHistoryFakeApi.make(body as BigNumber);
  }

  /** Generates a sample object */
  public static make(lspId: BigNumber): WoodstockGiftHistory[] {
    return [
      {
        idType: GiftIdentityAntecedent.LspGroupId,
        id: lspId,
        title: 'woodstock',
        giftSendDateUtc: toDateTime(faker.date.past()),
        requesterObjectId: faker.datatype.uuid(),
        giftInventory: {
          giftReason: faker.random.word(),
          inventory: {
            creditRewards: [
              {
                id: fakeBigNumber(),
                itemType: faker.datatype.uuid(),
                description: faker.random.words(5),
                quantity: faker.datatype.number(),
                error: undefined,
              },
            ],
            cars: [
              {
                id: fakeBigNumber(),
                itemType: faker.datatype.uuid(),
                description: faker.random.words(5),
                quantity: faker.datatype.number(),
                error: undefined,
              },
            ],
            carHorns: [
              {
                id: fakeBigNumber(),
                itemType: faker.datatype.uuid(),
                description: faker.random.words(5),
                quantity: faker.datatype.number(),
                error: undefined,
              },
            ],
            emotes: [
              {
                id: fakeBigNumber(),
                itemType: faker.datatype.uuid(),
                description: faker.random.words(5),
                quantity: faker.datatype.number(),
                error: undefined,
              },
            ],
            vanityItems: [
              {
                id: fakeBigNumber(),
                itemType: faker.datatype.uuid(),
                description: faker.random.words(5),
                quantity: faker.datatype.number(),
                error: undefined,
              },
            ],
            quickChatLines: [
              {
                id: fakeBigNumber(),
                itemType: faker.datatype.uuid(),
                description: faker.random.words(5),
                quantity: faker.datatype.number(),
                error: undefined,
              },
            ],
          },
        },
      },
    ];
  }
}
