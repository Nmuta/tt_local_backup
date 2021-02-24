import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { SunriseProfileSummary } from '@models/sunrise';
import { Unprocessed } from '@models/unprocessed';

/** Fake API for finding User Flags. */
export class SunrisePlayerXuidProfileSummaryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/player\/xuid\((\d+)\)\/profilesummary$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Unprocessed<SunriseProfileSummary> {
    return SunrisePlayerXuidProfileSummaryFakeApi.make();
  }

  /** Creates a sample object. */
  public static make(): Unprocessed<SunriseProfileSummary> {
    return {
      totalTombolaSpins: BigInt(13),
      totalSuperTombolaSpins: BigInt(0),
      currentCredits: BigInt(511830),
      maxCredits: BigInt(511830),
      housesPurchased: BigInt(0),
      unaccountedForCredits: BigInt(-359026),
      totalXp: BigInt(325702),
      hackFlags: [
        'FileDecryptionAuthFailure',
        'Checksum_ObfuscatedDataAccessors',
        'SeasonClockContentMismatch',
      ],
    };
  }
}
