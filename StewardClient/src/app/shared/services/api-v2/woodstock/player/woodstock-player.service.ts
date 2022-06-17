import { Injectable } from '@angular/core';
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
}
