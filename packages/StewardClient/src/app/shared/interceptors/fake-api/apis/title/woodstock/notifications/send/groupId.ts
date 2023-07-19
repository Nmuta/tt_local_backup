import { environment } from '@environments/environment';
import { FakeApiBase } from '@interceptors/fake-api/apis/fake-api-base';
import { CommunityMessageResult } from '@models/community-message';
import { GiftIdentityAntecedent } from '@shared/constants';
import BigNumber from 'bignumber.js';

/** Fake API for sending a community message to an lsp group. */
export class WoodstockSendCommunityMessageToLspGroupFakeApi extends FakeApiBase {
  private lspGroupId: BigNumber;

  /** True when this API is capable of handling the URL. */
  public get canHandle(): boolean {
    const targetingStewardApi = this.request.url.startsWith(environment.stewardApiUrl);
    if (!targetingStewardApi) {
      return false;
    }

    const url = new URL(this.request.url);
    const regex = /^\/?api\/v1\/title\/woodstock\/notifications\/send\/groupId\((.+)\)$/i;
    const isMatch = regex.test(url.pathname);
    if (!isMatch) {
      return false;
    }

    const match = url.pathname.match(regex);
    this.lspGroupId = new BigNumber(match[1]);
    return true;
  }

  /** Produces a sample API response. */
  public handle(): CommunityMessageResult<BigNumber> {
    return WoodstockSendCommunityMessageToLspGroupFakeApi.make(this.lspGroupId);
  }

  /** Creates a sample object. */
  public static make(lspGroupId: BigNumber): CommunityMessageResult<BigNumber> {
    return {
      playerOrLspGroup: lspGroupId,
      identityAntecedent: GiftIdentityAntecedent.LspGroupId,
      error: null,
    } as CommunityMessageResult<BigNumber>;
  }
}
