import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { HasPlayedRecord } from '@models/loyalty-rewards';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/woodstock/buildersCup endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockLoyaltyRewardsService {
  public readonly basePath: string = 'title/woodstock/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Get a player's previously played titles. */
  public getUserLoyalty$(
    xuid: BigNumber,
    externalProfileId: GuidLikeString,
  ): Observable<HasPlayedRecord[]> {
    const params = new HttpParams().append('externalProfileId', externalProfileId);

    return this.api.getRequest$<HasPlayedRecord[]>(`${this.basePath}/${xuid}/loyalty`, params);
  }

  /** Sends Loyalty Rewards for selected titles. */
  public postUserLoyalty$(
    xuid: BigNumber,
    externalProfileId: GuidLikeString,
    gameTitles: string[],
  ): Observable<void> {
    const params = new HttpParams().append('externalProfileId', externalProfileId);

    return this.api.postRequest$<void>(`${this.basePath}/${xuid}/loyalty`, gameTitles, params);
  }
}
