import { Injectable } from '@angular/core';
import { GiftResponse } from '@models/gift-response';
import { WoodstockUserGroupBulkLiveryGift } from '@models/woodstock/woodstock-gift.model';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { BigNumber } from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/woodstock/group/{groupId}/gift endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockGroupGiftService {
  public readonly basePath: string = 'title/woodstock/group';
  constructor(private readonly api: ApiV2Service) {}

  /** Sends many livery gifts to a user group. */
  public giftLiveriesByUserGroup$(
    giftReason: string,
    liveryIds: string[],
    userGroupId: BigNumber,
    expireTimeSpanInDays: BigNumber,
  ): Observable<GiftResponse<BigNumber>> {
    const model: WoodstockUserGroupBulkLiveryGift = {
      liveryIds,
      target: { giftReason, expireTimeSpanInDays },
    };

    return this.api.postRequest$(`${this.basePath}/${userGroupId}/gift/livery`, model);
  }
}
