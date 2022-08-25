import { Injectable } from '@angular/core';
import { BackgroundJob } from '@models/background-job';
import { BulkPlayerBulkLiveryGift } from '@models/gift';
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
  ): Observable<BackgroundJob<unknown>> {
    const model: BulkPlayerBulkLiveryGift = {
      liveryIds,
      target: { xuids, giftReason },
    };

    return this.api.postRequest$(`${this.basePath}/livery/useBackgroundProcessing`, model);
  }
}
