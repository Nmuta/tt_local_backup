import { environment } from '@environments/environment';
import faker from '@faker-js/faker';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { PlayerUgcItem } from '@models/player-ugc-item';

/** Fake API for finding player UGC items. */
export class ApolloPlayerXuidUgcFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/storefront$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): PlayerUgcItem[] {
    return ApolloPlayerXuidUgcFakeApi.makeMany();
  }

  /** Create many example models. */
  public static makeMany(): PlayerUgcItem[] {
    return new Array(faker.datatype.number({ min: 10, max: 25 })).fill(undefined).map(() => {
      return {} as PlayerUgcItem;
    });
  }
}
