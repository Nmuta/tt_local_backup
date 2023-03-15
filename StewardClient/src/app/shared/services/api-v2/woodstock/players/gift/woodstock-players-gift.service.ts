import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { WoodstockBulkPlayerBulkLiveryGift } from '@models/woodstock';
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

  /** Sends many livery gifts to a set of users. */
  public giftLiveriesByXuids$(
    giftReason: string,
    liveryIds: string[],
    xuids: BigNumber[],
    expireAfterDays: BigNumber,
  ): Observable<BackgroundJob<unknown>> {
    const model: WoodstockBulkPlayerBulkLiveryGift = {
      liveryIds,
      target: { xuids, giftReason, expireAfterDays },
    };

    return this.api.postRequest$(`${this.basePath}/livery/useBackgroundProcessing`, model);
  }
}
