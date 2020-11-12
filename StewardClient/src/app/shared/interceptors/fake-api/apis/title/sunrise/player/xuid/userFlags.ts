import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseUserFlags } from '@models/sunrise';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for finding User Flags. */
export class SunrisePlayerXuidUserFlagsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v2\/title\/sunrise\/player\/xuid\((\d+)\)\/userFlags/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Unprocessed<SunriseUserFlags> {
    return SunrisePlayerXuidUserFlagsFakeApi.make();
  }

  /** Generate an example. */
  public static make(): Unprocessed<SunriseUserFlags> {
    return {
      isVip: false,
      isUltimateVip: false,
      isTurn10Employee: false,
      isCommunityManager: false,
      isUnderReview: false,
      isEarlyAccess: false,
    };
  }
}
