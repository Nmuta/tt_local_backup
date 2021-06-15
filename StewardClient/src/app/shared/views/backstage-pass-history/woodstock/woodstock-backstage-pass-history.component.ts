import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { WoodstockService } from '@services/woodstock/woodstock.service';
import { Observable } from 'rxjs';
import { BackstagePassHistoryBaseComponent } from '../backstage-pass-history.base.component';
import { GameTitleCodeName } from '@models/enums';
import { BackstagePassHistory } from '@models/backstage-pass-history';

/** Retreives and displays Woodstock backstage pass history by XUID. */
@Component({
  selector: 'woodstock-backstage-pass-history',
  templateUrl: '../backstage-pass-history.component.html',
  styleUrls: ['../backstage-pass-history.component.scss'],
})
export class WoodstockBackstagePassHistoryComponent extends BackstagePassHistoryBaseComponent {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(private readonly woodstock: WoodstockService) {
    super();
  }

  /** Gets Woodstock player's list of backstage pass updates. */
  public getBackstagePassHistoryByXuid$(xuid: BigNumber): Observable<BackstagePassHistory[]> {
    return this.woodstock.getBackstagePassHistoryByXuid$(xuid);
  }
}
