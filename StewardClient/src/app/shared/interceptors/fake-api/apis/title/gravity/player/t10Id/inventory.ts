import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GravityPlayerInventory } from '@models/gravity';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { PlayerInventoryItem } from '@models/player-inventory-item';
import { toDateTime } from '@helpers/luxon';

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
  public static make(_t10Id: string): GravityPlayerInventory {
    function makeFakeItems(count: number): PlayerInventoryItem[] {
      return Array(faker.datatype.number(count))
        .fill(0)
        .map(() => {
          return {
            id: fakeBigNumber(),
            quantity: faker.datatype.number(5),
            description: faker.lorem.sentences(2),
            itemType: undefined,
            error: undefined,
            acquiredUtc: toDateTime(faker.date.past()),
          };
        });
    }

    return {
      gameSettingsId: faker.datatype.uuid(),
      externalProfileId: faker.datatype.uuid(),
      creditRewards: [
        {
          id: new BigNumber(0),
          description: 'Soft Currency',
          quantity: faker.datatype.number(100_000),
          itemType: undefined,
          error: undefined,
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
