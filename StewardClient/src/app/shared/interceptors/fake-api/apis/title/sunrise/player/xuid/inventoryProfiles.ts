import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunrisePlayerInventory } from '@models/sunrise';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for sunrise player inventory profiles. */
export class SunrisePlayerXuidInventoryProfilesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/xuid\((.+)\)\/inventoryProfiles$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<SunrisePlayerInventory>> {
    return SunrisePlayerXuidInventoryProfilesFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<SunrisePlayerInventory>> {
    return {
      xuid: 2533275026603041,
    };
  }
}
