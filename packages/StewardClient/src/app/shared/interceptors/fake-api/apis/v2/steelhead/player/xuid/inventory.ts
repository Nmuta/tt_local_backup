import { environment } from '@environments/environment';
import faker from '@faker-js/faker';
import { toDateTime } from '@helpers/luxon';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { SteelheadInventoryItemSource, SteelheadPlayerInventoryCarItem } from '@models/player-inventory-item';
import { SteelheadPlayerInventory, SteelheadPlayerInventoryItem } from '@models/steelhead';
import BigNumber from 'bignumber.js';

/** Fake API for steelhead player inventory. */
export class SteelheadPlayerInventoryFakeApi extends FakeApiBase {
  private xuid: BigNumber;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/player\/xuid\((.+)\)\/inventory$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.xuid = new BigNumber(match[1]);
    return true;
  }

  /** Produces a sample API response. */
  public handle(): SteelheadPlayerInventory {
    return SteelheadPlayerInventoryFakeApi.make(this.xuid);
  }

  /** Generates a sample object */
  public static make(_xuid?: BigNumber): SteelheadPlayerInventory {
    function makeFakeItems(count: number): SteelheadPlayerInventoryItem[] {
      return Array(faker.datatype.number(count))
        .fill(0)
        .map(() => {
          return {
            id: fakeBigNumber(),
            quantity: faker.datatype.number(1_000),
            description: faker.lorem.sentences(2),
            itemType: undefined,
            inventoryItemSource: SteelheadInventoryItemSource.Unknown,
            acquiredUtc: toDateTime(faker.date.past()),
            error: undefined,
          };
        });
    }

    const carsAsBasicInventoryItems = makeFakeItems(200);
    const cars = carsAsBasicInventoryItems.map(car => {
      return {
        ...car,
        vin: faker.datatype.uuid(),
        versionedLiveryId: faker.datatype.uuid(),
        versionedTuneId: faker.datatype.uuid(),
        currentLevel: new BigNumber(faker.datatype.number()),
        experiencePoints: new BigNumber(faker.datatype.number()),
      } as SteelheadPlayerInventoryCarItem;
    });

    return {
      creditRewards: [
        {
          id: new BigNumber(-1),
          description: 'Credits',
          quantity: faker.datatype.number(100_000_000),
          itemType: undefined,
          inventoryItemSource: SteelheadInventoryItemSource.Unknown,
          error: undefined,
        },
      ],
      cars: cars,
      vanityItems: makeFakeItems(200),
      driverSuits: makeFakeItems(200),
    };
  }
}
