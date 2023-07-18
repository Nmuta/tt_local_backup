import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { GiftResponse } from '@models/gift-response';
import { SteelheadGift, SteelheadUserGroupBulkLiveryGift } from '@models/steelhead';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { BigNumber } from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/steelhead/group/{groupId}/gift endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadGroupGiftService {
  public readonly basePath: string = 'title/steelhead/group';
  constructor(private readonly api: ApiV2Service) {}

  /** Gift lsp group inventory items. */
  public postGiftLspGroup$(
    userGroupId: BigNumber,
    gift: SteelheadGift,
  ): Observable<GiftResponse<BigNumber>> {
    return this.api.postRequest$<GiftResponse<BigNumber>>(
      `${this.basePath}/${userGroupId}/gift`,
      gift,
    );
  }

  /** Sends many livery gifts to a user group. */
  public giftLiveriesByUserGroup$(
    giftReason: string,
    liveryIds: string[],
    userGroupId: BigNumber,
    expireAfterDays: BigNumber,
    titleMessageId: GuidLikeString,
    bodyMessageId: GuidLikeString,
  ): Observable<GiftResponse<BigNumber>> {
    const model: SteelheadUserGroupBulkLiveryGift = {
      liveryIds,
      target: { giftReason, expireAfterDays, titleMessageId, bodyMessageId },
    };

    return this.api.postRequest$(`${this.basePath}/${userGroupId}/gift/livery`, model);
  }
}
