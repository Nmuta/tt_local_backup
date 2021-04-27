import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility/fake-bigint';
import { SteelheadGiftHistory } from '@models/steelhead';
import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import faker from 'faker';

/** Fake API for finding gift history. */
export class SteelheadGroupGroupIdGiftHistoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/group\/groupId\((.+)\)\/giftHistory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(body?: unknown): SteelheadGiftHistory[] {
    return SteelheadGroupGroupIdGiftHistoryFakeApi.make(body as BigNumber);
  }

  /** Generates a sample object */
  public static make(lspId: BigNumber): SteelheadGiftHistory[] {
    return [
      {
        idType: GiftIdentityAntecedent.LspGroupId,
        id: lspId,
        title: 'Steelhead',
        giftSendDateUtc: faker.date.past(),
        requestingAgent: faker.name.firstName(),
        giftInventory: {
          giftReason: faker.random.word(),
          inventory: {
            creditRewards: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.datatype.number(),
                itemType: undefined,
              },
            ],
            cars: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.datatype.number(),
                itemType: undefined,
              },
            ],
            vanityItems: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.datatype.number(),
                itemType: undefined,
              },
            ],
          },
        },
      },
    ];
  }
}
