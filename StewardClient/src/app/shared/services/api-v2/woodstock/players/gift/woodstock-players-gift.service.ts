import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { WoodstockBulkPlayerBulkLiveryGift, WoodstockGroupGift } from '@models/woodstock';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import { BigNumber } from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/woodstock/players/gifting endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayersGiftService {
  public readonly basePath: string = 'title/woodstock/players/gift';
  constructor(private readonly api: ApiV2Service) {}

  /** Gift players inventory items using a background task. */
  public postGiftPlayersUsingBackgroundTask$(
    gift: WoodstockGroupGift,
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
    expireTimeSpanInDays: BigNumber,
  ): Observable<BackgroundJob<unknown>> {
    const model: WoodstockBulkPlayerBulkLiveryGift = {
      liveryIds,
      target: { xuids, giftReason, expireTimeSpanInDays },
    };

    return this.api.postRequest$(`${this.basePath}/livery/useBackgroundProcessing`, model);
  }
}
