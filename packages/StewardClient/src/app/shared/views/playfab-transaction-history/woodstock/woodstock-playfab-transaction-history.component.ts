import { Component, Input, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayFabTransactionHistoryServiceContract } from '../playfab-transaction-history.component';
import { WoodstockPlayFabPlayerInventoryService } from '@services/api-v2/woodstock/playfab/player/inventory/woodstock-playfab-player-inventory.service';
import { PlayFabCollectionId } from '@models/playfab';

/**
 *  Woodstock PlayFab transaction history component.
 */
@Component({
  selector: 'woodstock-playfab-transaction-history',
  templateUrl: './woodstock-playfab-transaction-history.component.html',
})
export class WoodstockPlayFabTransactionHistoryComponent implements OnChanges {
  /** PlayFab player title entity id. */
  @Input() playfabPlayerTitleId: string;

  public service: PlayFabTransactionHistoryServiceContract;

  constructor(
    private readonly playFabPlayerInventoryService: WoodstockPlayFabPlayerInventoryService,
  ) {}

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    this.service = {
      gameTitle: GameTitle.FH5,
      getPlayFabTransactionHistory$: (playfabPlayerTitleId: string, collectionId: PlayFabCollectionId) =>
        this.playFabPlayerInventoryService.getTransactionHistory$(playfabPlayerTitleId, collectionId),
    };
  }
}
