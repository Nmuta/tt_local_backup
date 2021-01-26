import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { IdentityQueryAlpha, IdentityResultAlpha, isGamertagQuery, isXuidQuery } from '@models/identity-query.model';
import faker from 'faker';

/** Fake API for identifying players. */
export class OpusPlayersIdentitiesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/players\/identities$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(body?: unknown): IdentityResultAlpha[] {
    return OpusPlayersIdentitiesFakeApi.make(body as IdentityQueryAlpha[]);
  }

  /** Generates a sample object */
  public static make(queries: IdentityQueryAlpha[]): IdentityResultAlpha[] {
    return queries.map(query => {
      return <IdentityResultAlpha>{
        query: query,
        gamertag: isGamertagQuery(query) ? query.gamertag : faker.name.firstName(),
        xuid: isXuidQuery(query) ? query.xuid : BigInt(faker.random.number()),
      }
    });
  }
}
