import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { WoodstockCreditDetailsEntry } from '@models/woodstock';
import { Observable, throwError } from 'rxjs';
import {
  CreditHistoryBaseComponent,
  CreditUpdateColumn,
  SortDirection,
} from '../credit-history.base.component';
import { GameTitleCodeName } from '@models/enums';
import { ProfileRollbackHistory } from '@models/profile-rollback-history.model';
import { WoodstockPlayerCreditUpdatesService } from '@services/api-v2/woodstock/player/credit-updates/woodstock-credit-updates.service';

/** Retreives and displays Woodstock credit history by XUID. */
@Component({
  selector: 'woodstock-credit-history',
  templateUrl: '../credit-history.component.html',
  styleUrls: ['../credit-history.component.scss'],
})
export class WoodstockCreditHistoryComponent extends CreditHistoryBaseComponent<WoodstockCreditDetailsEntry> {
  public gameTitle = GameTitleCodeName.FH5;
  public isSaveRollbackSupported = false;

  constructor(private readonly woodstock: WoodstockPlayerCreditUpdatesService) {
    super();
  }

  /** Gets Woodstock player's list of credit updates. */
  public getCreditHistoryByXuid$(
    xuid: BigNumber,
    column: CreditUpdateColumn,
    direction: SortDirection,
    startIndex: number,
    maxResults: number,
  ): Observable<WoodstockCreditDetailsEntry[]> {
    return this.woodstock.getCreditHistoryByXuid$(xuid, direction, column, startIndex, maxResults);
  }

  /** Gets save rollbacks history list */
  public getSaveRollbackHistoryByXuid$(_xuid: BigNumber): Observable<ProfileRollbackHistory[]> {
    return throwError(new Error('Woodstock does not support save rollback.'));
  }
}
