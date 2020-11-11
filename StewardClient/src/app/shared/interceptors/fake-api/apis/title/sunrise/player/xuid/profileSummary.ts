import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseProfileSummary } from '@models/sunrise/sunrise-profile-summary.model';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for finding User Flags. */
export class SunrisePlayerXuidProfileSummaryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(
      environment.stewardApiUrl
    );
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /\/?api\/v2\/title\/sunrise\/player\/xuid\((\d+)\)\/profilesummary/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Unprocessed<SunriseProfileSummary> {
    return SunrisePlayerXuidProfileSummaryFakeApi.make();
  }

  /** Creates a sample object. */
  public static make(): Unprocessed<SunriseProfileSummary> {
    return {
      totalTombolaSpins: 13,
      totalSuperTombolaSpins: 0,
      currentCredits: 511830,
      maxCredits: 511830,
      housesPurchased: 0,
      unaccountedForCredits: -359026,
      totalXp: 325702,
      hackFlags: [
        'FileDecryptionAuthFailure',
        'Checksum_ObfuscatedDataAccessors',
        'SeasonClockContentMismatch',
      ],
    };
  }
}
