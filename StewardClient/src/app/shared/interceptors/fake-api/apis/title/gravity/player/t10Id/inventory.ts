import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GravityPlayerInventoryBeta } from '@models/gravity';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { fakeBigInt, faker } from '@interceptors/fake-api/utility';

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
  public handle(): GravityPlayerInventoryBeta {
    return GravityPlayerT10IdInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): GravityPlayerInventoryBeta {
    function makeFakeItems(count: number): MasterInventoryItem[] {
      return Array(faker.random.number(count))
        .fill(0)
        .map(() => {
          return {
            id: fakeBigInt(),
            quantity: faker.random.number(5),
            description: faker.lorem.sentences(2),
            itemType: undefined,
          };
        });
    }

    return {
      gameSettingsId: faker.random.uuid(),
      externalProfileId: faker.random.uuid(),
      creditRewards: [
        {
          id: BigInt(0),
          description: 'Soft Currency',
          quantity: faker.random.number(100_000),
          itemType: undefined,
        },
      ],
      cars: makeFakeItems(200),
      masteryKits: makeFakeItems(200),
      upgradeKits: makeFakeItems(200),
      repairKits: makeFakeItems(200),
      energyRefills: makeFakeItems(200),
    };
  }
}
