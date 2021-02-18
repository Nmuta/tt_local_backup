import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigInt, faker } from '@interceptors/fake-api/utility';
import { OpusPlayerInventory } from '@models/opus';

/** Fake API for opus player inventory. */
export class OpusPlayerXuidInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    if (this.request.method.toUpperCase() !== 'GET') {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/opus\/player\/xuid\((.+)\)\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): OpusPlayerInventory {
    return OpusPlayerXuidInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): OpusPlayerInventory {
    return {
      credits: fakeBigInt({ min: 0 }),
      cars: Array(faker.random.number(200))
        .fill(0)
        .map(() => {
          return {
            quantity: BigInt(1),
            vin: faker.random.uuid(),
            baseCost: fakeBigInt({ min: 4_000 }),
            collectorScore: fakeBigInt({ min: 4_000, max: 200_000 }),
            isOnlineOnly: faker.random.boolean(),
            productionNumber: fakeBigInt({ min: 4_000, max: 200_000 }),
            purchaseUtc: faker.date.past(),
            versionedLiveryId: faker.random.uuid(),
            versionedTuneId: faker.random.uuid(),
            carId: fakeBigInt(),
            dateCreatedUtc: faker.date.past(2 /*years*/),
            displayName: faker.lorem.words(3),
            special: faker.random.arrayElement(['Unicorn', '']),
          };
        }),
    };
  }
}
