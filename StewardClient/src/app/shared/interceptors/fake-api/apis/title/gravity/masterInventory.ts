import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GravityMasterInventory } from '@models/gravity';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for getting master inventory. */
export class GravityMasterInventoryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/gravity\/masterInventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<GravityMasterInventory>> {
    return GravityMasterInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<GravityMasterInventory>> {
    return {
      creditRewards: [],
      cars: [],
      repairKits: [],
      masteryKits: [],
      upgradeKits: [],
      energyRefills: [],
    };
  }
}