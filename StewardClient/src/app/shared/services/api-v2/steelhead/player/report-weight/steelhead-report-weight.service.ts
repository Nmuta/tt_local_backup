import { Injectable } from '@angular/core';
import { ReportWeightType, UserReportWeight } from '@models/report-weight';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/title/steelhead/player/{xuid}/reportWeight endpoints. */
@Injectable({
  providedIn: 'root',
})
export class SteelheadPlayerReportWeightService {
  public readonly basePath: string = 'title/steelhead/player';
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
}
