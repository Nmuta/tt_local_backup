import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WoodstockCreditDetailsEntry } from '@models/woodstock';
import { ApiV2Service } from '@services/api-v2/api-v2.service';
import {
  CreditUpdateColumn,
  SortDirection,
} from '@views/credit-history/credit-history.base.component';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';

/** The /v2/woodstock/player/{xuid}/creditUpdates endpoints. */
@Injectable({
  providedIn: 'root',
})
export class WoodstockPlayerCreditUpdatesService {
  public readonly basePath: string = 'title/woodstock/player';
  constructor(private readonly api: ApiV2Service) {}

  /** Gets a player's credit history by XUID. */
  public getCreditHistoryByXuid$(
    xuid: BigNumber,
    sortOrder: SortDirection = SortDirection.Ascending,
    column: CreditUpdateColumn = CreditUpdateColumn.Timestamp,
    startIndex: number = 0,
    maxResults: number = 100,
  ): Observable<WoodstockCreditDetailsEntry[]> {
    const httpParams = new HttpParams()
      .set('sortDirection', sortOrder)
      .set('column', column)
      .set('startIndex', startIndex.toString())
      .set('maxResults', maxResults.toString());
    return this.api.getRequest$<WoodstockCreditDetailsEntry[]>(
      `${this.basePath}/${xuid}/creditUpdates`,
      httpParams,
    );
  }
}
