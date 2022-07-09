import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GuidLikeString } from '@models/extended-types';
import { HasPlayedRecord } from '@models/loyalty-rewards';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable, throwError } from 'rxjs';

/** The /v2/woodstock/ugc/search endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayerService {
  public readonly basePath: string = 'title/woodstock/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Get a player's report weight. */
  public getUserReportWeight$(xuid: BigNumber): Observable<number> {
    return this.api.getRequest$<number>(`${this.basePath}/${xuid}/reportWeight`);
  }

  /** Set a player's report weight. */
  public setUserReportWeight$(xuid: BigNumber, reportWeight: number): Observable<void> {
    if (reportWeight < 0 || reportWeight > 100) {
      return throwError(
        () =>
          new Error(`Report weight must be between 0 and 100. Provided value was: ${reportWeight}`),
      );
    }

    return this.api.postRequest$<void>(`${this.basePath}/${xuid}/reportWeight`, reportWeight);
  }

  /** Gets a record of which legacy titles a player has played. */
  public getUserHasPlayedRecord$(
    xuid: BigNumber,
    externalProfileId: GuidLikeString,
  ): Observable<HasPlayedRecord[]> {
    const params = new HttpParams().append('externalProfileId', externalProfileId);

    return this.api.getRequest$<HasPlayedRecord[]>(
      `${this.basePath}/${xuid}/hasPlayedRecord`,
      params,
    );
  }

  /** Sends Loyalty Rewards for selected titles. */
  public postResendLoyaltyRewards$(
    xuid: BigNumber,
    externalProfileId: GuidLikeString,
    gameTitles: string[],
  ): Observable<void> {
    const params = new HttpParams().append('externalProfileId', externalProfileId);

    return this.api.postRequest$<void>(
      `${this.basePath}/${xuid}/loyaltyRewards/send`,
      gameTitles,
      params,
    );
  }
}
