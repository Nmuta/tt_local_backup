import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { fakeBigNumber } from '@interceptors/fake-api/utility';
import { GiftResponse } from '@models/gift-response';
import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';

/** Fake API for gifting to lsp group. */
export class SunriseGiftLiveryToLspGroupFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/gifting\/livery\((\d+)\)\/groupId\((\d+)\)$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): GiftResponse<BigNumber> {
    return SunriseGiftLiveryToLspGroupFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): GiftResponse<BigNumber> {
    return {
      playerOrLspGroup: fakeBigNumber(),
      identityAntecedent: GiftIdentityAntecedent.LspGroupId,
      errors: undefined,
    };
  }
}
