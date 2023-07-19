import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SteelheadUserFlags } from '@models/steelhead';

/** Fake API for finding User Flags. */
export class SteelheadPlayerXuidUserFlagsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/player\/xuid\((\d+)\)\/userFlags$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): SteelheadUserFlags {
    return SteelheadPlayerXuidUserFlagsFakeApi.make();
  }

  /** Generate an example. */
  public static make(): SteelheadUserFlags {
    return {
      isGamecoreVip: false,
      isGamecoreUltimateVip: false,
      isSteamVip: false,
      isSteamUltimateVip: false,
      isTurn10Employee: false,
      isUnderReview: false,
      isEarlyAccess: false,
      isRaceMarshall: false,
      isCommunityManager: false,
      isContentCreator: false,
    };
  }
}
