import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SteelheadPlayerInventory } from '@models/steelhead';
import faker from 'faker';

/** Fake API for steelhead player inventory. */
export class SteelheadGroupGamertagsInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    if (this.request.method.toUpperCase() !== 'POST') {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/group\/gamertags\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SteelheadPlayerInventory {
    return SteelheadGroupGamertagsInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): SteelheadPlayerInventory {
    return {
      xuid: new BigNumber(2533275026603041),
      giftReason: faker.random.words(10),
      credits: new BigNumber(faker.random.number(999_999_999)),
      cars: [],
      mods: [],
      vanityItems: [],
      packs: [],
      badges: [],
    };
  }
}
