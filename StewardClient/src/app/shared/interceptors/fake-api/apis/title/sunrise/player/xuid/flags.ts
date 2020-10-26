import { environment } from "@environments/environment";
import { FakeApiBase } from "@interceptors/fake-api/apis/fake-api-base";

/** Fake API for finding User Flags. */
export class SunrisePlayerXuidFlagsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) { return false };

    const url = new URL(this.request.url);
    const regex = /sunrise\/player\/xuid\((\d+)\)\/flags/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): object {
    return {
      isVip: false,
      isUltimateVip: false,
      isTurn10Employee: false,
      isCommunityManager: false,
      isWhiteListed: false,
      isUnderReview: false,
    };
  }
}