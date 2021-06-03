import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { WoodstockPlayerInventory } from '@models/woodstock';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';
import { PlayerInventoryItem } from '@models/player-inventory-item';
import { toDateTime } from '@helpers/luxon';

/** Fake API for woodstock player inventory. */
export class WoodstockPlayerXuidInventoryFakeApi extends FakeApiBase {
  private xuid: BigNumber;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/player\/xuid\((.+)\)\/inventory$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.xuid = new BigNumber(match[1]);
    return true;
  }

  /** Produces a sample API response. */
  public handle(): WoodstockPlayerInventory {
    return WoodstockPlayerXuidInventoryFakeApi.make(this.xuid);
  }

  /** Generates a sample object */
  public static make(_xuid: BigNumber): WoodstockPlayerInventory {
    function makeFakeItems(count: number): PlayerInventoryItem[] {
      return Array(faker.datatype.number(count))
        .fill(0)
        .map(() => {
          return {
            id: fakeBigNumber(),
            quantity: faker.datatype.number(5),
            description: faker.lorem.sentences(2),
            itemType: undefined,
            dateAquiredUtc: toDateTime(faker.date.past()),
          };
        });
    }

    return {
      creditRewards: [
        {
          id: new BigNumber(-1),
          description: 'Credits',
          quantity: faker.datatype.number(400_000_000),
          itemType: undefined,
        },
        {
          id: new BigNumber(-1),
          description: 'WheelSpins',
          quantity: faker.datatype.number(400_000_000),
          itemType: undefined,
        },
        {
          id: new BigNumber(-1),
          description: 'SuperWheelSpins',
          quantity: faker.datatype.number(400_000_000),
          itemType: undefined,
        },
        {
          id: new BigNumber(-1),
          description: 'SkillPoints',
          quantity: faker.datatype.number(400_000_000),
          itemType: undefined,
        },
        {
          id: new BigNumber(-1),
          description: 'ForzathonPoints',
          quantity: faker.datatype.number(400_000_000),
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
