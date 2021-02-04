import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigInt, faker } from '@interceptors/fake-api/utility';
import { SunrisePlayerInventory } from '@models/sunrise';
import { SunriseCar, SunriseInventoryItem } from '@models/sunrise/inventory-items';

/** Fake API for sunrise player inventory. */
export class SunrisePlayerXuidInventoryFakeApi extends FakeApiBase {
  private xuid: bigint;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/xuid\((.+)\)\/inventory$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.xuid = BigInt(match[1]);
    return true;
  }

  /** Produces a sample API response. */
  public handle(): SunrisePlayerInventory {
    return SunrisePlayerXuidInventoryFakeApi.make(this.xuid);
  }

  /** Generates a sample object */
  public static make(xuid: bigint): SunrisePlayerInventory {
    function makeFakeItems(count: number): SunriseInventoryItem[] {
      return Array(faker.random.number(count))
        .fill(0)
        .map(() => {
          return {
            itemId: fakeBigInt(),
            quantity: fakeBigInt({ min: 1, max: 20 }),
            acquisitionUtc: faker.date.past(),
            modifiedUtc: faker.date.recent(),
            lastUsedUtc: faker.date.recent(),
            description: faker.lorem.sentences(2),
          };
        });
    }

    function makeFakeCars(count: number): SunriseCar[] {
      return makeFakeItems(count).map(i => {
        return {
          ...i,
          vin: faker.random.uuid(),
          baseCost: fakeBigInt({ min: 4_000 }),
          collectorScore: fakeBigInt({ min: 4_000, max: 200_000 }),
          isOnlineOnly: faker.random.boolean(),
          productionNumber: fakeBigInt({ min: 4_000, max: 200_000 }),
          purchaseUtc: faker.date.past(),
          versionedLiveryId: faker.random.uuid(),
          versionedTuneId: faker.random.uuid(),
        };
      });
    }

    return {
      xuid: xuid,
      credits: fakeBigInt({ min: 0 }),
      wheelSpins: fakeBigInt({ min: 0 }),
      superWheelSpins: fakeBigInt({ min: 0 }),
      skillPoints: fakeBigInt({ min: 0 }),
      forzathonPoints: fakeBigInt({ min: 0 }),
      cars: makeFakeCars(200),
      rebuilds: makeFakeItems(200),
      vanityItems: makeFakeItems(200),
      carHorns: makeFakeItems(200),
      quickChatLines: makeFakeItems(200),
      creditRewards: makeFakeItems(200),
      emotes: makeFakeItems(200),
      barnFindRumors: makeFakeItems(200),
      perks: makeFakeItems(200),
      giftReason: faker.lorem.paragraph(),
    };
  }
}
