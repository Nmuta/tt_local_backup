import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { GuidLikeString } from '@models/extended-types';
import { SteelheadBulkPlayerBulkLiveryGift, SteelheadGroupGift } from '@models/steelhead';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { BigNumber } from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/steelhead/players/gifting endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayersGiftService {
  public readonly basePath: string = 'title/steelhead/players/gift';
  constructor(private readonly api: ApiV2Service) {}

  /** Gift players inventory items using a background task. */
  public postGiftPlayersUsingBackgroundTask$(
    gift: SteelheadGroupGift,
  ): Observable<BackgroundJob<void>> {
    return this.api.postRequest$<BackgroundJob<void>>(
      `${this.basePath}/useBackgroundProcessing`,
      gift,
    );
  }

  /** Sends many livery gifts to a set of users. */
  public giftLiveriesByXuids$(
    giftReason: string,
    liveryIds: string[],
    xuids: BigNumber[],
    expireAfterDays: BigNumber,
    titleMessageId: GuidLikeString,
    bodyMessageId: GuidLikeString,
  ): Observable<BackgroundJob<unknown>> {
    const model: SteelheadBulkPlayerBulkLiveryGift = {
      liveryIds,
      target: { xuids, giftReason, expireAfterDays, titleMessageId, bodyMessageId },
    };

    return this.api.postRequest$(`${this.basePath}/livery/useBackgroundProcessing`, model);
  }
}
