import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { PlayFabVoucher } from '@services/api-v2/woodstock/playfab/vouchers/woodstock-playfab-vouchers.service';
import { PlayFabInventoryItem } from '@services/api-v2/woodstock/playfab/player/inventory/woodstock-playfab-player-inventory.service';

/** Service contract for the PlayFabInventoryComponent. */
export interface PlayFabInventoryServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  /** Gets player transaction history. */
  getPlayFabCurrencyInventory$(playfabPlayerTitleId: string): Observable<PlayFabInventoryItem[]>;
  /** Gets available vouchers. */
  getPlayFabVouchers$(): Observable<PlayFabVoucher[]>;
}

/** Component view and manage a PlayFab player inventory. */
@Component({
  selector: 'playfab-inventory',
  templateUrl: './playfab-inventory.component.html',
  styleUrls: ['./playfab-inventory.component.scss'],
})
export class PlayFabInventoryComponent extends BaseComponent implements OnInit, OnChanges {
  /** The component service contract */
  @Input() service: PlayFabInventoryServiceContract;

  /** PlayFab player title entity id. */
  @Input() playfabPlayerTitleId: string;

  public getVoucherMonitor = new ActionMonitor('Get PlayFab vouchers');
  public getInventoryMonitor = new ActionMonitor('Get PlayFab inventory');

  public displayedColumns = ['amount', 'item', 'metadata'];
  public inventoryItems = new BetterMatTableDataSource<PlayFabInventoryItem>([]);
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
      });
  }

  /** Lifecycle hook. */
  public ngOnChanges(changes: BetterSimpleChanges<PlayFabInventoryComponent>): void {
    if (!this.service) {
      throw new Error('No service is defined for PlayFab transaction history component.');
    }

    if (!!changes.playfabPlayerTitleId && !!this.playfabPlayerTitleId) {
      this.service
        .getPlayFabCurrencyInventory$(this.playfabPlayerTitleId)
        .pipe(this.getInventoryMonitor.monitorSingleFire())
        .subscribe(inventoryItems => {
          this.inventoryItems.data = inventoryItems;
        });
    }
  }
}
