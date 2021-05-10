import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { WoodstockConsoleDetailsEntry } from '@models/woodstock';

/** Fake API for finding User Flags. */
export class WoodstockConsoleIsBannedFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const isPut = this.request.method.toLowerCase() === 'put';
    if (!isPut) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/console\/consoleId\((\d+)\)\/isBanned\((true|false)\)$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): WoodstockConsoleDetailsEntry[] {
    return WoodstockConsoleIsBannedFakeApi.make();
  }

  /** Creates a sample response object. */
  public static make(): WoodstockConsoleDetailsEntry[] {
    return null;
  }
}
