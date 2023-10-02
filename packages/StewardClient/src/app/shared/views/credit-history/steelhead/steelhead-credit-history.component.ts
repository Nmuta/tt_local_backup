import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {
  CreditHistoryBaseComponent,
  CreditUpdateColumn,
  SortDirection,
} from '../credit-history.base.component';
import { GameTitle } from '@models/enums';
import { ProfileRollbackHistory } from '@models/profile-rollback-history.model';
import { Store } from '@ngxs/store';
import {
  UserSettingsStateModel,
  UserSettingsState,
} from '@shared/state/user-settings/user-settings.state';
import { SteelheadCreditDetailsEntry } from '@models/steelhead/steelhead-credit-history.model';
import { SteelheadPlayerCreditUpdatesService } from '@services/api-v2/steelhead/player/credit-updates/steelhead-credit-updates.service';

/** Retreives and displays steelhead credit history by XUID. */
@Component({
  selector: 'steelhead-credit-history',
  templateUrl: '../credit-history.component.html',
  styleUrls: ['../credit-history.component.scss'],
})
export class SteelheadCreditHistoryComponent extends CreditHistoryBaseComponent<SteelheadCreditDetailsEntry> {
  public gameTitle = GameTitle.FH5;
  public isSaveRollbackSupported = false;

  constructor(
    private readonly store: Store,
    private readonly creditUpdatesService: SteelheadPlayerCreditUpdatesService,
  ) {
    super();
  }

  /** Gets Steelhead player's list of credit updates. */
  public getCreditHistoryByXuid$(
    xuid: BigNumber,
    column: CreditUpdateColumn,
    direction: SortDirection,
    startIndex: number,
    maxResults: number,
  ): Observable<SteelheadCreditDetailsEntry[]> {
    return this.creditUpdatesService.getCreditHistoryByXuid$(
      xuid,
      direction,
      column,
      startIndex,
      maxResults,
    );
  }

  /** Gets save rollbacks history list */
  public getSaveRollbackHistoryByXuid$(_xuid: BigNumber): Observable<ProfileRollbackHistory[]> {
    return throwError(new Error('Steelhead does not support save rollback.'));
  }

  /** Gets the current selected endpoint */
  public getEndpoint(): string {
    return this.store.selectSnapshot<UserSettingsStateModel>(UserSettingsState)
      .steelheadEndpointKey;
  }
}
