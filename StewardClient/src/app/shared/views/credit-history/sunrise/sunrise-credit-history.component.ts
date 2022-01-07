import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SunriseCreditDetailsEntry } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import { CreditHistoryBaseComponent } from '../credit-history.base.component';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays Sunrise credit history by XUID. */
@Component({
  selector: 'sunrise-credit-history',
  templateUrl: '../credit-history.component.html',
  styleUrls: ['../credit-history.component.scss'],
})
export class SunriseCreditHistoryComponent extends CreditHistoryBaseComponent<SunriseCreditDetailsEntry> {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Gets Woodstock player's list of credit updates. */
  public getCreditHistoryByXuid$(
    xuid: BigNumber,
    startIndex: number,
    maxResults: number,
  ): Observable<SunriseCreditDetailsEntry[]> {
    return this.sunrise.getCreditHistoryByXuid$(xuid, startIndex, maxResults);
  }
}
