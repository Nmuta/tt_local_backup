import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import {
  PlayFabTransaction,
  PlayFabTransactionOperation,
} from '@services/api-v2/woodstock/playfab/player/transactions/woodstock-playfab-player-transactions.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { PlayFabVoucher } from '@services/api-v2/woodstock/playfab/vouchers/woodstock-playfab-vouchers.service';
import { MatPaginator } from '@angular/material/paginator';

/** Service contract for the PlayFabTransactionHistoryComponent. */
export interface PlayFabTransactionHistoryServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  /** Gets player transaction history. */
  getPlayFabTransactionHistory$(playfabPlayerTitleId: string): Observable<PlayFabTransaction[]>;
  /** Gets available vouchers. */
  getPlayFabVouchers$(): Observable<PlayFabVoucher[]>;
}

type InternalPlayFabTransactionOperation = PlayFabTransactionOperation & {
  itemName: string;
};

type InternalPlayFabTransaction = PlayFabTransaction & {
  internalOperations: InternalPlayFabTransactionOperation[];
};

/** Component to get and set a player's cms override. */
@Component({
  selector: 'playfab-transaction-history',
  templateUrl: './playfab-transaction-history.component.html',
  styleUrls: ['./playfab-transaction-history.component.scss'],
})
export class PlayFabTransactionHistoryComponent extends BaseComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  /** The component service contract */
  @Input() service: PlayFabTransactionHistoryServiceContract;

  /** PlayFab player title entity id. */
  @Input() playfabPlayerTitleId: string;

  public getVoucherMonitor = new ActionMonitor('Get PlayFab vouchers');
  public getTransactionsMonitor = new ActionMonitor('Get PlayFab transaction history');

  public displayedColumns = ['metadata', 'details', 'operations'];
  public transactionHistory = new BetterMatTableDataSource<InternalPlayFabTransaction>([]);
  public vouchers: PlayFabVoucher[] = [];

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.service
      .getPlayFabVouchers$()
      .pipe(this.getVoucherMonitor.monitorSingleFire())
      .subscribe(vouchers => {
        this.vouchers = vouchers;

        // If pulling tansaction history occurs before getting vouchers, repopulate the table with newly available voucher data
        if (this.transactionHistory.data?.length > 0) {
          this.transactionHistory.data = this.convertToInternalTransaction(
            this.transactionHistory.data,
          );
        }
      });
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<PlayFabTransactionHistoryComponent>): void {
    if (!this.service) {
      throw new Error('No service is defined for PlayFab transaction history component.');
    }

    if (!!changes.playfabPlayerTitleId && !!this.playfabPlayerTitleId) {
      this.service
        .getPlayFabTransactionHistory$(this.playfabPlayerTitleId)
        .pipe(this.getTransactionsMonitor.monitorSingleFire())
        .subscribe(transactionHistory => {
          this.connectPaginatorToTable();
          this.transactionHistory.data = this.convertToInternalTransaction(transactionHistory);
        });
    }
  }

  private convertToInternalTransaction(
    transactions: PlayFabTransaction[],
  ): InternalPlayFabTransaction[] {
    if (this.vouchers?.length <= 0) {
      return transactions as InternalPlayFabTransaction[];
    }

    return transactions.map(transaction => {
      const internalTransaction = transaction as InternalPlayFabTransaction;
      internalTransaction.internalOperations = transaction.operations.map(operation => {
        const internalOperation = operation as InternalPlayFabTransactionOperation;
        const voucher = this.vouchers.find(voucher => voucher.id === operation.itemId);
        internalOperation.itemName = voucher?.title['NEUTRAL'] ?? null;
        return internalOperation;
      });

      return internalTransaction;
    });
  }

  private connectPaginatorToTable(): void {
    this.transactionHistory.paginator = this.paginator;
  }
}
