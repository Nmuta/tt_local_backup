import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GiftResponses } from '@models/gift-response';
import { Unprocessed } from '@models/unprocessed';
import { GiftHistoryAntecedent } from '@shared/constants';

/** Fake API for gifting to players. */
export class SunriseGiftingPlayersFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/gifting\/players$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): Partial<Unprocessed<GiftResponses<bigint>>> {
    return SunriseGiftingPlayersFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): Partial<Unprocessed<GiftResponses<bigint>>> {
    return [
      {
        playerOrLspGroup: BigInt(1234),
        identityAntecedent: GiftHistoryAntecedent.Xuid,
        error: undefined,
      },
      {
        playerOrLspGroup: BigInt(5678),
        identityAntecedent: GiftHistoryAntecedent.Xuid,
        error: { message: 'fake api error' },
      }
    ];
  }
}
