import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { WoodstockCreditDetailsEntry } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock/woodstock.service';
import { Observable } from 'rxjs';
import { CreditHistoryBaseComponent } from '../credit-history.base.component';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays Woodstock credit history by XUID. */
@Component({
  selector: 'woodstock-credit-history',
  templateUrl: '../credit-history.component.html',
  styleUrls: ['../credit-history.component.scss'],
})
export class WoodstockCreditHistoryComponent extends CreditHistoryBaseComponent<
  WoodstockCreditDetailsEntry
> {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(private readonly woodstock: WoodstockService) {
    super();
  }

  /** Gets Woodstock player's list of credit updates. */
  public getCreditHistoryByXuid$(
    xuid: BigNumber,
    startIndex: number,
    maxResults: number,
  ): Observable<WoodstockCreditDetailsEntry[]> {
    return this.woodstock.getCreditHistoryByXuid$(xuid, startIndex, maxResults);
  }
}
