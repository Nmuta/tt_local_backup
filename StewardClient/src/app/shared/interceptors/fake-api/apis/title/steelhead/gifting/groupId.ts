import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GiftResponse } from '@models/gift-response';
import { GiftIdentityAntecedent } from '@shared/constants';

/** Fake API for gifting to lsp group. */
export class SteelheadGiftingLspGroupFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/steelhead\/gifting\/groupId$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): GiftResponse<number> {
    return SteelheadGiftingLspGroupFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): GiftResponse<number> {
    return {
      playerOrLspGroup: 123,
      identityAntecedent: GiftIdentityAntecedent.LspGroupId,
      error: undefined,
    };
  }
}
