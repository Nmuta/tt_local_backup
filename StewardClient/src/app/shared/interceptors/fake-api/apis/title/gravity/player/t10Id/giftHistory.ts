import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility/fake-bigint';
import { GravityGiftHistory } from '@models/gravity';
import { Unprocessed } from '@models/unprocessed';
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
  public handle(body?: unknown): Partial<Unprocessed<GravityGiftHistory[]>> {
    return GravityPlayerT10IdGiftHistoryFakeApi.make(body as string);
  }

  /** Generates a sample object */
  public static make(t10Id: string): Partial<Unprocessed<GravityGiftHistory[]>> {
    return [
      {
        idType: 'T10Id',
        id: t10Id,
        title: 'Gravity',
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
            masteryKits: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.datatype.number(),
              },
            ],
            upgradeKits: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.datatype.number(),
              },
            ],
            repairKits: [
              {
                id: fakeBigNumber(),
                description: faker.random.word(),
                quantity: faker.datatype.number(),
              },
            ],
            energyRefills: [
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
