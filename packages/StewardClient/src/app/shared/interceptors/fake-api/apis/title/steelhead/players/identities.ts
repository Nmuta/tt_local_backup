import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import {
  IdentityQueryAlpha,
  IdentityResultAlpha,
  isGamertagQuery,
  isXuidQuery,
} from '@models/identity-query.model';
import { fakeGamertag, fakeXuid } from '@interceptors/fake-api/utility';

/** Fake API for identifying players. */
export class SteelheadPlayersIdentitiesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/players\/identities$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(body?: unknown): IdentityResultAlpha[] {
    return SteelheadPlayersIdentitiesFakeApi.make(body as IdentityQueryAlpha[]);
  }

  /** Generates a sample object */
  public static make(queries: IdentityQueryAlpha[]): IdentityResultAlpha[] {
    return queries.map(query => {
      return <IdentityResultAlpha>{
        query: query,
        gamertag: isGamertagQuery(query) ? query.gamertag : fakeGamertag(),
        xuid: isXuidQuery(query) ? query.xuid : fakeXuid(),
      };
    });
  }
}
