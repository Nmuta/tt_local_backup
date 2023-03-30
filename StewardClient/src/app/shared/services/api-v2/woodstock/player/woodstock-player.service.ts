import { Injectable } from '@angular/core';
import { ReportWeightType, UserReportWeight } from '@models/report-weight';
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

  /** Gets user game details. */
  public getUserGameDetails$(xuid: BigNumber): Observable<PlayerGameDetails> {
    return this.api.getRequest$<PlayerGameDetails>(`${this.basePath}/xuid/${xuid}/gamedetails`);
  }
}
