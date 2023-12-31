import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';

/** Fake API for deleting leaderboard scores. */
export class WoodstockLeaderboardScoresDeleteFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/leaderboard\/scores\/delete$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): void {
    // EMPTY
  }
}
