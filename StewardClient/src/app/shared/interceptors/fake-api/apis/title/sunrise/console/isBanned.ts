import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseConsoleDetails } from '@models/sunrise/sunrise-console-details.model';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for finding User Flags. */
export class SunriseConsoleIsBannedFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(
      environment.stewardApiUrl
    );
    if (!targetingStewardApi) {
      return false;
    }

    const isPut = this.request.method.toLowerCase() === 'put';
    if (!isPut) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v2\/title\/sunrise\/console\/consoleId\((\d+)\)\/isBanned\((true|false)\)/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): object {
    return SunriseConsoleIsBannedFakeApi.makeMany();
  }

  /** Creates a sample response object. */
  public static makeMany(): Unprocessed<SunriseConsoleDetails> {
    return null;
  }
}
