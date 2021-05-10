import BigNumber from 'bignumber.js';
import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GiftResponse } from '@models/gift-response';
import { GiftIdentityAntecedent } from '@shared/constants';

/** Fake API for gifting to players. */
export class WoodstockGiftingPlayersFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/gifting\/players$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): GiftResponse<BigNumber>[] {
    return WoodstockGiftingPlayersFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): GiftResponse<BigNumber>[] {
    return [
      {
        playerOrLspGroup: new BigNumber(1234),
        identityAntecedent: GiftIdentityAntecedent.Xuid,
        error: undefined,
      },
      {
        playerOrLspGroup: new BigNumber(5678),
        identityAntecedent: GiftIdentityAntecedent.Xuid,
        error: { message: 'fake api error' },
      },
    ];
  }
}
