import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SunriseCreditDetailsEntry } from '@models/sunrise';
import { Observable } from 'rxjs';
import {
  CreditHistoryBaseComponent,
  CreditUpdateColumn,
  SortDirection,
} from '../credit-history.base.component';
import { GameTitle } from '@models/enums';
import { ProfileRollbackHistory } from '@models/profile-rollback-history.model';
import { SunrisePlayerService } from '@services/api-v2/sunrise/sunrise-player.service';
import { SunrisePlayerCreditUpdatesService } from '@services/api-v2/sunrise/player/credit-updates/sunrise-credit-updates.service';
import { Store } from '@ngxs/store';
import {
  UserSettingsStateModel,
  UserSettingsState,
} from '@shared/state/user-settings/user-settings.state';

/** Retreives and displays Sunrise credit history by XUID. */
@Component({
  selector: 'sunrise-credit-history',
  templateUrl: '../credit-history.component.html',
  styleUrls: ['../credit-history.component.scss'],
})
export class SunriseCreditHistoryComponent extends CreditHistoryBaseComponent<SunriseCreditDetailsEntry> {
  public gameTitle = GameTitle.FH4;
  public isSaveRollbackSupported = true;

  constructor(
    private readonly store: Store,
    private readonly sunrise: SunrisePlayerCreditUpdatesService,
    private readonly sunrisePlayerService: SunrisePlayerService,
  ) {
    super();
  }

  /** Gets Sunrise player's list of credit updates. */
  public getCreditHistoryByXuid$(
    xuid: BigNumber,
    column: CreditUpdateColumn,
    direction: SortDirection,
    startIndex: number,
    maxResults: number,
  ): Observable<SunriseCreditDetailsEntry[]> {
    return this.sunrise.getCreditHistoryByXuid$(xuid, direction, column, startIndex, maxResults);
  }

  /** Gets save rollbacks history list */
  public getSaveRollbackHistoryByXuid$(xuid: BigNumber): Observable<ProfileRollbackHistory[]> {
    return this.sunrisePlayerService.getProfileRollbackHistoryXuid$(xuid);
  }

  /** Gets the current selected endpoint */
  public getEndpoint(): string {
    return this.store.selectSnapshot<UserSettingsStateModel>(UserSettingsState).sunriseEndpointKey;
  }
}
