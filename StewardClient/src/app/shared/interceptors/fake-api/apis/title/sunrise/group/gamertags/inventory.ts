import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunrisePlayerInventory } from '@models/sunrise';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for sunrise player inventory. */
export class SunriseGroupGamertagsInventoryFakeApi extends FakeApiBase {
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
    const regex = /^\/?api\/v1\/title\/sunrise\/group\/gamertags\/inventory$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<SunrisePlayerInventory>> {
    return SunriseGroupGamertagsInventoryFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<SunrisePlayerInventory>> {
    return {
      xuid: new BigNumber(2533275026603041),
    };
  }
}
