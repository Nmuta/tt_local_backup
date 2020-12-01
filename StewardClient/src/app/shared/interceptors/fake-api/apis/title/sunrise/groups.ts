import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for sunrise groups. */
export class SunriseGroupsFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    if(this.request.method.toUpperCase() !== 'GET') {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v1\/title\/sunrise\/groups/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<unknown[]>> {
    return SunriseGroupsFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<unknown[]>> {
    return [
      {
        xuid: 2533275026603041,
        name: 'Test Group'
      }
    ];
  }
}
