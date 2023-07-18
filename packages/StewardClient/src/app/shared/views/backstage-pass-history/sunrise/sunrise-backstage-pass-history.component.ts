import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import { BackstagePassHistoryBaseComponent } from '../backstage-pass-history.base.component';
import { GameTitleCodeName } from '@models/enums';
import { BackstagePassHistory } from '@models/backstage-pass-history';

/** Retreives and displays Sunrise backstage pass history by XUID. */
@Component({
  selector: 'sunrise-backstage-pass-history',
  templateUrl: '../backstage-pass-history.component.html',
  styleUrls: ['../backstage-pass-history.component.scss'],
})
export class SunriseBackstagePassHistoryComponent extends BackstagePassHistoryBaseComponent {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Gets Woodstock player's list of backstage pass updates. */
  public getBackstagePassHistoryByXuid$(xuid: BigNumber): Observable<BackstagePassHistory[]> {
    return this.sunrise.getBackstagePassHistoryByXuid$(xuid);
  }
}
