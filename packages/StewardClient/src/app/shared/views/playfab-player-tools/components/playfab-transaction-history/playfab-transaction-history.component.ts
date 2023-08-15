import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { MatPaginator } from '@angular/material/paginator';
import { renderGuard } from '@helpers/rxjs';
import { PlayFabCollectionId, PlayFabTransaction, PlayFabVoucher } from '@models/playfab';
import { PlayFabProfile } from '@services/api-v2/woodstock/players/playfab/woodstock-players-playfab.service';

/** Service contract for the PlayFabTransactionHistoryComponent. */
export interface PlayFabTransactionHistoryServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  /** Gets player transaction history. */
  getPlayFabTransactionHistory$(
    playfabPlayerTitleId: string,
    collectionId: PlayFabCollectionId,
  ): Observable<PlayFabTransaction[]>;
}

/** Component to get and set a player's cms override. */
@Component({
  selector: 'playfab-transaction-history',
  templateUrl: './playfab-transaction-history.component.html',
  styleUrls: ['./playfab-transaction-history.component.scss'],
})
export class PlayFabTransactionHistoryComponent extends BaseComponent implements OnChanges {
  @ViewChild(MatPaginator) set paginatorEl(paginatorEl: MatPaginator) {
    // initially setter gets called with undefined
    if (paginatorEl) {
      this.paginator = paginatorEl;
    }
  }

  /** The component service contract */
  @Input() service: PlayFabTransactionHistoryServiceContract;

  /** PlayFab player profile. */
  @Input() playfabProfile: PlayFabProfile;

  /** PlayFab collection id. */
  @Input() playfabCollectionId: PlayFabCollectionId;

  public getVoucherMonitor = new ActionMonitor('Get PlayFab vouchers');
  public getTransactionsMonitor = new ActionMonitor('Get PlayFab transaction history');

  public displayedColumns = ['metadata', 'details', 'operations'];
  public transactionHistory = new BetterMatTableDataSource<PlayFabTransaction>([]);
  public vouchers: PlayFabVoucher[] = [];

  public paginator: MatPaginator;

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<PlayFabTransactionHistoryComponent>): void {
    if (!this.service) {
      throw new Error('No service is defined for PlayFab transaction history component.');
    }

    if (
      (!!changes.playfabProfile || !!changes.playfabCollectionId) &&
      !!this.playfabProfile?.title &&
      !!this.playfabCollectionId
    ) {
      this.getTransactionsMonitor = this.getTransactionsMonitor.repeat();
      this.service
        .getPlayFabTransactionHistory$(this.playfabProfile?.title, this.playfabCollectionId)
        .pipe(this.getTransactionsMonitor.monitorSingleFire())
        .subscribe(transactionHistory => {
          this.transactionHistory.data = transactionHistory;

          renderGuard(() => {
            this.connectPaginatorToTable();
          });
        });
    }
  }

  private connectPaginatorToTable(): void {
    this.transactionHistory.paginator = this.paginator;
  }
}
