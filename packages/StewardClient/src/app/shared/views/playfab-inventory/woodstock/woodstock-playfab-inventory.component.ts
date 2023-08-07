import { Component, Input, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayFabInventoryServiceContract } from '../playfab-inventory.component';
import { WoodstockPlayFabVouchersService } from '@services/api-v2/woodstock/playfab/vouchers/woodstock-playfab-vouchers.service';
import { WoodstockPlayFabPlayerInventoryService } from '@services/api-v2/woodstock/playfab/player/inventory/woodstock-playfab-player-inventory.service';
import { PlayFabCollectionId } from '@models/playfab';

/**
 *  Woodstock cms override component.
 */
@Component({
  selector: 'woodstock-playfab-inventory',
  templateUrl: './woodstock-playfab-inventory.component.html',
})
export class WoodstockPlayFabInventoryComponent implements OnChanges {
  /** PlayFab player title entity id. */
  @Input() playfabPlayerTitleId: string;

  public service: PlayFabInventoryServiceContract;

  constructor(
    private readonly playFabPlayerInventoryService: WoodstockPlayFabPlayerInventoryService,
    private readonly playFabVouchersService: WoodstockPlayFabVouchersService,
  ) {}

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    this.service = {
      gameTitle: GameTitle.FH5,
      getPlayFabCurrencyInventory$: (playfabPlayerTitleId: string, collectionId: PlayFabCollectionId) =>
        this.playFabPlayerInventoryService.getCurrencyInventory$(playfabPlayerTitleId, collectionId),
      getPlayFabVouchers$: () => this.playFabVouchersService.getVouchers$(),
    };
  }
}
