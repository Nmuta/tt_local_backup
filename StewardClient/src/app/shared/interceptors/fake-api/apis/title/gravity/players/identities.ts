import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import {
  IdentityQueryBeta,
  IdentityResultBeta,
  isGamertagQuery,
  isT10IdQuery,
  isXuidQuery,
} from '@models/identity-query.model';
import faker from 'faker';

/** Fake API for identifying players. */
export class GravityPlayersIdentitiesFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/gravity\/players\/identities$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(body?: unknown): IdentityResultBeta[] {
    return GravityPlayersIdentitiesFakeApi.make(body as IdentityQueryBeta[]);
  }

  /** Generates a sample object */
  public static make(queries: IdentityQueryBeta[]): IdentityResultBeta[] {
    return queries.map(query => {
      return <IdentityResultBeta>{
        query: query,
        gamertag: isGamertagQuery(query) ? query.gamertag : faker.name.firstName(),
        xuid: isXuidQuery(query) ? query.xuid : BigInt(faker.random.number()),
        t10id: isT10IdQuery(query) ? query.t10Id : faker.random.uuid(),
      };
    });
  }
}
