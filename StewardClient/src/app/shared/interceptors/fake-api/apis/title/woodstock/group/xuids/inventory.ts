import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { WoodstockPlayerInventory } from '@models/woodstock';
import { fakeBigNumber, faker } from '@interceptors/fake-api/utility';

/** Fake API for woodstock player inventory. */
export class WoodstockGroupXuidsInventoryFakeApi extends FakeApiBase {
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
    const regex = /^\/?api\/v1\/title\/woodstock\/group\/xuids\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): WoodstockPlayerInventory {
    return WoodstockGroupXuidsInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): WoodstockPlayerInventory {
    return {
      xuid: fakeBigNumber(),
      barnFindRumors: [],
      carHorns: [],
      cars: [],
      creditRewards: [],
      credits: fakeBigNumber(),
      emotes: [],
      forzathonPoints: fakeBigNumber(),
      giftReason: faker.lorem.sentence(),
      perks: [],
      quickChatLines: [],
      rebuilds: [],
      skillPoints: fakeBigNumber(),
      superWheelSpins: fakeBigNumber(),
      vanityItems: [],
      wheelSpins: fakeBigNumber(),
    };
  }
}
