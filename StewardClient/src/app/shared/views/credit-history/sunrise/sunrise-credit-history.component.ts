import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SunriseCreditDetailsEntry } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import { CreditHistoryBaseComponent } from '../credit-history.base.component';
import { GameTitleCodeName } from '@models/enums';
import { ProfileRollbackHistory } from '@models/profile-rollback-history.model';
import { SunrisePlayerService } from '@services/api-v2/sunrise/sunrise-player.service';

/** Retreives and displays Sunrise credit history by XUID. */
@Component({
  selector: 'sunrise-credit-history',
  templateUrl: '../credit-history.component.html',
  styleUrls: ['../credit-history.component.scss'],
})
export class SunriseCreditHistoryComponent extends CreditHistoryBaseComponent<SunriseCreditDetailsEntry> {
  public gameTitle = GameTitleCodeName.FH4;
  public isSaveRollbackSupported = true;

  constructor(
    private readonly sunrise: SunriseService,
    private readonly sunrisePlayerService: SunrisePlayerService,
  ) {
    super();
  }

  /** Gets Sunrise player's list of credit updates. */
  public getCreditHistoryByXuid$(
    xuid: BigNumber,
    startIndex: number,
    maxResults: number,
  ): Observable<SunriseCreditDetailsEntry[]> {
    return this.sunrise.getCreditHistoryByXuid$(xuid, startIndex, maxResults);
  }

  /** Gets save rollbacks history list */
  public getSaveRollbackHistoryByXuid$(xuid: BigNumber): Observable<ProfileRollbackHistory[]> {
    return this.sunrisePlayerService.getProfileRollbackHistoryXuid$(xuid);
  }
}
