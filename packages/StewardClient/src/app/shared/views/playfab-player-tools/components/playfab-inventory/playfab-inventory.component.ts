import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { Observable } from 'rxjs';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { PlayFabCollectionId, PlayFabInventoryItem, PlayFabVoucher } from '@models/playfab';

/** Service contract for the PlayFabInventoryComponent. */
export interface PlayFabInventoryServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  /** Gets player transaction history. */
  getPlayFabCurrencyInventory$(
    playfabPlayerTitleId: string,
    playFabCollectionId: PlayFabCollectionId,
  ): Observable<PlayFabInventoryItem[]>;
  /** Gets available vouchers. */
  getPlayFabVouchers$(): Observable<PlayFabVoucher[]>;
}

/** Component to get and set a player's cms override. */
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

  /** PlayFab collection id. */
  @Input() playfabCollectionId: PlayFabCollectionId;

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

    if (
      (!!changes.playfabPlayerTitleId || !!changes.playfabCollectionId) &&
      !!this.playfabPlayerTitleId &&
      !!this.playfabCollectionId
    ) {
      this.getInventoryMonitor = this.getInventoryMonitor.repeat();
      this.service
        .getPlayFabCurrencyInventory$(this.playfabPlayerTitleId, this.playfabCollectionId)
        .pipe(this.getInventoryMonitor.monitorSingleFire())
        .subscribe(inventoryItems => {
          this.inventoryItems.data = inventoryItems;
        });
    }
  }
}
