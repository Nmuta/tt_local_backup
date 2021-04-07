import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { ApolloUserFlags } from '@models/apollo';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for finding User Flags. */
export class ApolloPlayerXuidUserFlagsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/apollo\/player\/xuid\((\d+)\)\/userFlags$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Unprocessed<ApolloUserFlags> {
    return ApolloPlayerXuidUserFlagsFakeApi.make();
  }

  /** Generate an example. */
  public static make(): Unprocessed<ApolloUserFlags> {
    return {
      isVip: false,
      isTurn10Employee: false,
      isCommunityManager: false,
      isUnderReview: false,
      isEarlyAccess: false,
    };
  }
}
