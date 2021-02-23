import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigInt, faker, fakeXuid } from '@interceptors/fake-api/utility';
import { GuidLikeString } from '@models/extended-types';
import { GravityPlayerInventory } from '@models/gravity';
import { GravityCar, GravityInventoryItem, GravityKit } from '@models/gravity/inventory-items';

/** Fake API for gravity player inventory. */
export class GravityPlayerT10IdInventoryFakeApi extends FakeApiBase {
  private t10Id: string;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/gravity\/player\/t10Id\((.+)\)\/inventory$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.t10Id = match[1];
    return true;
  }

  /** Produces a sample API response. */
  public handle(): GravityPlayerInventory {
    return GravityPlayerT10IdInventoryFakeApi.make(this.t10Id);
  }

  /** Generates a sample object */
  public static make(t10Id: GuidLikeString, profileId?: GuidLikeString): GravityPlayerInventory {
    function makeFakeItems(count: number): GravityInventoryItem[] {
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

    function makeFakeKits(count: number): GravityKit[] {
      return makeFakeItems(count).map(i => {
        return {
          ...i,
          partialQuantity: fakeBigInt({ min: 0, max: 100 }),
        };
      });
    }

    function makeFakeCars(count: number): GravityCar[] {
      return makeFakeItems(count).map(i => {
        return {
          ...i,
          vin: faker.random.uuid(),
          purchaseUtc: faker.date.past(),
          currentMasteryRank: fakeBigInt({ min: 0, max: 20 }),
          cumulativeMastery: fakeBigInt({ min: 0, max: 20 }),
          repairState: fakeBigInt({ min: 0 }),
          starPoints: fakeBigInt({ min: 0 }),
          color: fakeBigInt({ min: 0 }),
          livery: fakeBigInt({ min: 0 }),
          clientPr: fakeBigInt({ min: 0 }),
          advancedCarCustomization: fakeBigInt({ min: 0 }),
        };
      });
    }

    return {
      xuid: fakeXuid(),
      t10Id: t10Id,
      previousGameSettingsId: faker.random.uuid(),
      currentExternalProfileId: profileId ?? faker.random.uuid(),
      cars: makeFakeCars(200),
      masteryKits: makeFakeItems(200),
      upgradeKits: makeFakeKits(200),
      repairKits: makeFakeKits(200),
      packs: makeFakeItems(200),
      currencies: makeFakeItems(200),
      energyRefills: makeFakeItems(200),
    };
  }
}
