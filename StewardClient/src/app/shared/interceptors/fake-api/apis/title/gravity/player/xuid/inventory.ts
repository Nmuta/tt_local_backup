import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { GravityPlayerInventory } from '@models/gravity';
import faker from 'faker';
import { PlayerInventoryItem } from '@models/player-inventory-item';
import { toDateTime } from '@helpers/luxon';

/** Fake API for gravity player inventory. */
export class GravityPlayerXuidInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/gravity\/player\/xuid\((.+)\)\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): GravityPlayerInventory {
    return GravityPlayerXuidInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): GravityPlayerInventory {
    function makeFakeItems(count: number): PlayerInventoryItem[] {
      return Array(faker.datatype.number(count))
        .fill(0)
        .map(() => {
          return {
            id: fakeBigNumber(),
            quantity: faker.datatype.number(5),
            description: faker.lorem.sentences(2),
            itemType: undefined,
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
