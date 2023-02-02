import BigNumber from 'bignumber.js';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameTitle } from '@models/enums';
import { IdentityResultUnion } from '@models/identity-query.model';
import { PlayerGameDetails } from '@models/player-game-details.model';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BetterSimpleChanges } from '@helpers/simple-changes';

export interface PlayerGameDetailsContract {
  gameTitle: GameTitle;
  getPlayerGameDetails$(xuid: BigNumber): Observable<PlayerGameDetails>;
}

/** Retrieves and displays Player Game Details by XUID. */
@Component({
  selector: 'player-game-details',
  templateUrl: './player-game-details.component.html',
  styleUrls: ['./player-game-details.component.scss'],
})
export class PlayerGameDetailsBaseComponent extends BaseComponent implements OnChanges {
  /** Service contract for player game details component. */
  @Input() service: PlayerGameDetailsContract;
  /** The identity to look up. If the identity does not have a XUID nothing will happen. */
  @Input() public identity: IdentityResultUnion;

  /** The player game detail to display. */
  public playerGameDetails: PlayerGameDetails;
  /** The action monitor to monitor the query for game details. */
  public getMonitor: ActionMonitor = new ActionMonitor('GET player game details');

  constructor() {
    super();
  }

  /** Lifecycle hook. */
  public ngOnChanges(_changes: BetterSimpleChanges<PlayerGameDetailsBaseComponent>): void {
    if (!this.identity?.xuid) {
      return;
    }

    this.getMonitor = this.getMonitor.repeat();

    const getPlayerGameDetails$ = this.service.getPlayerGameDetails$(this.identity.xuid);
    getPlayerGameDetails$
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(playerGameDetails => {
        this.playerGameDetails = playerGameDetails;
      });
  }
}
