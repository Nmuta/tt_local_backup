import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import faker from '@faker-js/faker';
import { PlayerUgcItem } from '@models/player-ugc-item';

/** Fake API for finding player UGC items. */
export class SunrisePlayerXuidUgcFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/storefront$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): PlayerUgcItem[] {
    return SunrisePlayerXuidUgcFakeApi.makeMany();
  }

  /** Create many example models. */
  public static makeMany(): PlayerUgcItem[] {
    return new Array(faker.datatype.number({ min: 10, max: 25 })).fill(undefined).map(() => {
      return {} as PlayerUgcItem;
    });
  }
}
