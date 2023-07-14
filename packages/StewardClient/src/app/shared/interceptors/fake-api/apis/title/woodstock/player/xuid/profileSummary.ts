import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { WoodstockProfileSummary } from '@models/woodstock';

/** Fake API for finding User Flags. */
export class WoodstockPlayerXuidProfileSummaryFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/player\/xuid\((\d+)\)\/profilesummary$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): WoodstockProfileSummary {
    return WoodstockPlayerXuidProfileSummaryFakeApi.make();
  }

  /** Creates a sample object. */
  public static make(): WoodstockProfileSummary {
    return {
      totalTombolaSpins: new BigNumber(13),
      totalSuperTombolaSpins: new BigNumber(0),
      currentCredits: new BigNumber(511830),
      maxCredits: new BigNumber(511830),
      housesPurchased: new BigNumber(0),
      unaccountedForCredits: new BigNumber(-359026),
      totalXp: new BigNumber(325702),
      hackFlags: [
        'FileDecryptionAuthFailure',
        'Checksum_ObfuscatedDataAccessors',
        'SeasonClockContentMismatch',
      ],
    };
  }
}
