import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { MasterInventoryItem } from '@models/master-inventory-item';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { fakeBigInt, faker } from '@interceptors/fake-api/utility';

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
  public handle(): SunriseMasterInventory {
    return SunrisePlayerXuidInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SunriseMasterInventory {
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
      creditRewards: [
        {
          id: BigInt(-1),
          description: 'Credits',
          quantity: faker.random.number(400_000_000),
          itemType: undefined,
        },
        {
          id: BigInt(-1),
          description: 'WheelSpins',
          quantity: faker.random.number(400_000_000),
          itemType: undefined,
        },
        {
          id: BigInt(-1),
          description: 'SuperWheelSpins',
          quantity: faker.random.number(400_000_000),
          itemType: undefined,
        },
        {
          id: BigInt(-1),
          description: 'SkillPoints',
          quantity: faker.random.number(400_000_000),
          itemType: undefined,
        },
        {
          id: BigInt(-1),
          description: 'ForzathonPoints',
          quantity: faker.random.number(400_000_000),
          itemType: undefined,
        },
      ],
      cars: makeFakeItems(200),
      vanityItems: makeFakeItems(200),
      carHorns: makeFakeItems(200),
      quickChatLines: makeFakeItems(200),
      emotes: makeFakeItems(200),
    };
  }
}
