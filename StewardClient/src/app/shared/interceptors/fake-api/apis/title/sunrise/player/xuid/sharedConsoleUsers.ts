import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseSharedConsoleUsers } from '@models/sunrise/sunrise-shared-console-users.model';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for finding User Flags. */
export class SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(
      environment.stewardApiUrl
    );
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v2\/title\/sunrise\/player\/xuid\((\d+)\)\/sharedConsoleUsers/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): object {
    return SunrisePlayerXuidConsoleSharedConsoleUsersFakeApi.makeMany();
  }

  /** Creates a sample response. */
  public static makeMany(): Unprocessed<SunriseSharedConsoleUsers> {
    return [
      {
        sharedConsoleId: 17942385017267761210,
        xuid: 2535460485267489,
        gamertag: 'temporary1021',
        everBanned: false,
      },
    ];
  }
}
