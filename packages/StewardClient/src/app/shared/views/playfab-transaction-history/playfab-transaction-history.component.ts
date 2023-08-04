import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { PlayFabTransaction } from '@services/api-v2/woodstock/playfab/player/transactions/woodstock-playfab-player-transactions.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';

/** Service contract for the PlayFabTransactionHistoryComponent. */
export interface PlayFabTransactionHistoryServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  /** Gets player transaction history. */
  getPlayFabTransactionHistory$(playfabPlayerTitleId: string): Observable<PlayFabTransaction[]>;
}

/** Component to get and set a player's cms override. */
@Component({
  selector: 'playfab-transaction-history',
  templateUrl: './playfab-transaction-history.component.html',
  styleUrls: ['./playfab-transaction-history.component.scss'],
})
export class PlayFabTransactionHistoryComponent extends BaseComponent implements OnChanges {
  /** The component service contract */
  @Input() service: PlayFabTransactionHistoryServiceContract;

  /** PlayFab player title entity id. */
  @Input() playfabPlayerTitleId: string;

  public getMonitor = new ActionMonitor('Get PlayFab transaction history');
  public transactionHistory = new BetterMatTableDataSource<PlayFabTransaction>([]);

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Lifecycle hook. */
  public ngOnChanges(_changes: BetterSimpleChanges<PlayFabTransactionHistoryComponent>): void {
    if (!this.service) {
      throw new Error('No service is defined for PlayFab transaction history component.');
    }

    // Lookup transaction history when a new entity id is provided
    this.service.getPlayFabTransactionHistory$(this.playfabPlayerTitleId).pipe(this.getMonitor.monitorSingleFire()).subscribe(transactionHistory => {
      this.transactionHistory.data = transactionHistory;
    });
  }
}
