import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReportWeightType, UserReportWeight } from '@models/report-weight';
import { GuidLikeString } from '@models/extended-types';
import { HasPlayedRecord } from '@models/loyalty-rewards';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { PlayerGameDetails } from '@models/player-game-details.model';

/** The /v2/woodstock/player endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayerService {
  public readonly basePath: string = 'title/woodstock/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Get a player's report weight. */
  public getUserReportWeight$(xuid: BigNumber): Observable<UserReportWeight> {
    return this.api.getRequest$<UserReportWeight>(`${this.basePath}/${xuid}/reportWeight`);
  }

  /** Set a player's report weight. */
  public setUserReportWeight$(
    xuid: BigNumber,
    reportWeightType: ReportWeightType,
  ): Observable<UserReportWeight> {
    return this.api.postRequest$<UserReportWeight>(
      `${this.basePath}/${xuid}/reportWeight`,
      reportWeightType,
    );
  }

  /** Gets a record of which legacy titles a player has played. */
  public getUserHasPlayedRecord$(
    xuid: BigNumber,
    externalProfileId: GuidLikeString,
  ): Observable<HasPlayedRecord[]> {
    const params = new HttpParams().append('externalProfileId', externalProfileId);

    return this.api.getRequest$<HasPlayedRecord[]>(
      `${this.basePath}/${xuid}/loyaltyRewards/hasPlayedRecord`,
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

  /** Gets user game details. */
  public getUserGameDetails$(xuid: BigNumber): Observable<PlayerGameDetails> {
    return this.api.getRequest$<PlayerGameDetails>(`${this.basePath}/xuid/${xuid}/gamedetails`);
  }
}
