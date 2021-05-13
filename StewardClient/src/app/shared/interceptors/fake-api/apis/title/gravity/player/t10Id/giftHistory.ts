import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility/fake-bigint';
import { GravityGiftHistory } from '@models/gravity';
import { GiftIdentityAntecedent } from '@shared/constants';
import faker from 'faker';

/** Fake API for finding gift history. */
export class GravityPlayerT10IdGiftHistoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/gravity\/player\/t10Id\((.+)\)\/giftHistory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(body?: unknown): GravityGiftHistory[] {
    return GravityPlayerT10IdGiftHistoryFakeApi.make(body as string);
  }

  /** Generates a sample object */
  public static make(t10Id: string): GravityGiftHistory[] {
    return [
      {
        idType: GiftIdentityAntecedent.T10Id,
        id: t10Id,
        title: 'gravity',
        giftSendDateUtc: faker.date.past(),
        requesterObjectId: faker.random.uuid(),
        giftInventory: {
          giftReason: faker.random.word(),
          inventory: {
            creditRewards: [
              {
                id: fakeBigNumber(),
                itemType: faker.datatype.uuid(),
                description: faker.random.words(3),
                quantity: faker.datatype.number(),
              },
            ],
            cars: [
              {
                id: fakeBigNumber(),
                itemType: faker.datatype.uuid(),
                description: faker.random.words(3),
                quantity: faker.datatype.number(),
              },
            ],
            masteryKits: [
              {
                id: fakeBigNumber(),
                itemType: faker.datatype.uuid(),
                description: faker.random.words(3),
                quantity: faker.datatype.number(),
              },
            ],
            upgradeKits: [
              {
                id: fakeBigNumber(),
                itemType: faker.datatype.uuid(),
                description: faker.random.words(3),
                quantity: faker.datatype.number(),
              },
            ],
            repairKits: [
              {
                id: fakeBigNumber(),
                itemType: faker.datatype.uuid(),
                description: faker.random.words(3),
                quantity: faker.datatype.number(),
              },
            ],
            energyRefills: [
              {
                id: fakeBigNumber(),
                itemType: faker.datatype.uuid(),
                description: faker.random.words(3),
                quantity: faker.datatype.number(),
              },
            ],
          },
        },
      },
    ];
  }
}
