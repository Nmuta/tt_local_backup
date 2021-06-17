import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { CommunityMessageResult } from '@models/community-message';
import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';
import faker from 'faker';

/** Fake API for sending a community message. */
export class SunriseSendCommunityMessageFakeApi extends FakeApiBase {
  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/sunrise\/notifications\/send$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    return true;
  }

  /** Produces a sample API response. */
  public handle(): CommunityMessageResult<BigNumber>[] {
    return SunriseSendCommunityMessageFakeApi.make();
  }

  /** Creates a sample object. */
  public static make(min: number = 1): CommunityMessageResult<BigNumber>[] {
    return new Array(faker.datatype.number({ min: min, max: 10 })).fill(undefined).map(
      () =>
        <CommunityMessageResult<BigNumber>>{
          playerOrLspGroup: new BigNumber(
            faker.datatype.number({ min: 100_000_000, max: 999_999_999 }),
          ),
          identityAntecedent: GiftIdentityAntecedent.Xuid,
          error: null,
        },
    );
  }
}
