import { Component, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { PlayFabVoucher } from '@services/api-v2/woodstock/playfab/vouchers/woodstock-playfab-vouchers.service';
import { MatPaginator } from '@angular/material/paginator';
import { renderGuard } from '@helpers/rxjs';
import { PlayFabInventoryItem } from '@services/api-v2/woodstock/playfab/player/inventory/woodstock-playfab-player-inventory.service';

/** Service contract for the PlayFabInventoryComponent. */
export interface PlayFabInventoryServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  /** Gets player transaction history. */
  getPlayFabInventory$(playfabPlayerTitleId: string): Observable<PlayFabInventoryItem[]>;
  /** Gets available vouchers. */
  getPlayFabVouchers$(): Observable<PlayFabVoucher[]>;
}

type InternalPlayFabInventoryItem = PlayFabInventoryItem & {
  itemName: string;
};

/** Component to get and set a player's cms override. */
@Component({
  selector: 'playfab-inventory',
  templateUrl: './playfab-inventory.component.html',
  styleUrls: ['./playfab-inventory.component.scss'],
})
export class PlayFabInventoryComponent extends BaseComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) set paginatorEl(paginatorEl: MatPaginator) {
    // initially setter gets called with undefined
    if (paginatorEl) {
      this.paginator = paginatorEl;
    }
  }

  /** The component service contract */
  @Input() service: PlayFabInventoryServiceContract;

  /** PlayFab player title entity id. */
  @Input() playfabPlayerTitleId: string;

  public getVoucherMonitor = new ActionMonitor('Get PlayFab vouchers');
  public getTransactionsMonitor = new ActionMonitor('Get PlayFab transaction history');

  public displayedColumns = ['metadata', 'details'];
  public inventoryItems = new BetterMatTableDataSource<InternalPlayFabInventoryItem>([]);
  public vouchers: PlayFabVoucher[] = [];

  public paginator: MatPaginator;

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
        if (this.inventoryItems.data?.length > 0) {
          this.inventoryItems.data = this.convertToInternalTransaction(this.inventoryItems.data);
        }
      });
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<PlayFabInventoryComponent>): void {
    if (!this.service) {
      throw new Error('No service is defined for PlayFab transaction history component.');
    }

    if (!!changes.playfabPlayerTitleId && !!this.playfabPlayerTitleId) {
      this.service
        .getPlayFabInventory$(this.playfabPlayerTitleId)
        .pipe(this.getTransactionsMonitor.monitorSingleFire())
        .subscribe(inventoryItems => {
          this.inventoryItems.data = this.convertToInternalTransaction(inventoryItems);

          renderGuard(() => {
            this.connectPaginatorToTable();
          });
        });
    }
  }

  private convertToInternalTransaction(
    inventoryItems: PlayFabInventoryItem[],
  ): InternalPlayFabInventoryItem[] {
    if (this.vouchers?.length <= 0) {
      return inventoryItems as InternalPlayFabInventoryItem[];
    }

    return inventoryItems.map(item => {
      const internalItem = item as InternalPlayFabInventoryItem;
      const voucher = this.vouchers.find(voucher => voucher.id === internalItem.id);
      internalItem.itemName = voucher?.title['NEUTRAL'] ?? null;
      return internalItem;
    });
  }

  private connectPaginatorToTable(): void {
    this.inventoryItems.paginator = this.paginator;
  }
}
