import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { GiftResponse } from '@models/gift-response';
import { GiftIdentityAntecedent } from '@shared/constants';

/** Fake API for gifting to player. */
export class GravityGiftingPlayerFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/gravity\/gifting\/t10Id$/i;
    return regex.test(url.pathname);
  }

  /** Produces a sample API response. */
  public handle(): GiftResponse<string> {
    return GravityGiftingPlayerFakeApi.make();
  }

  /** Generates a sample object */
  public static make(): GiftResponse<string> {
    return {
      playerOrLspGroup: 'Fake T10 ID',
      identityAntecedent: GiftIdentityAntecedent.T10Id,
      errors: undefined,
    };
  }
}
