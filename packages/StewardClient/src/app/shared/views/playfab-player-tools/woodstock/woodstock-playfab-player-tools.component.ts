import { Component, Input, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayFabPlayerToolsServiceContract } from '../playfab-player-tools.component';
import { WoodstockPlayersPlayFabService } from '@services/api-v2/woodstock/players/playfab/woodstock-players-playfab.service';
import BigNumber from 'bignumber.js';
import { WoodstockPlayFabPlayerInventoryService } from '@services/api-v2/woodstock/playfab/player/inventory/woodstock-playfab-player-inventory.service';
import { WoodstockPlayFabVouchersService } from '@services/api-v2/woodstock/playfab/vouchers/woodstock-playfab-vouchers.service';
import { PlayFabInventoryServiceContract } from '../components/playfab-inventory/playfab-inventory.component';
import { PlayFabTransactionHistoryServiceContract } from '../components/playfab-transaction-history/playfab-transaction-history.component';
import { PlayFabCollectionId } from '@models/playfab';

/**
 *  Woodstock PlayFab player tools.
 */
@Component({
  selector: 'woodstock-playfab-player-tools',
  templateUrl: './woodstock-playfab-player-tools.component.html',
})
export class WoodstockPlayFabPlayerToolsComponent implements OnChanges {
  /** Player XUID to build playfab tools around. */
  @Input() xuid: BigNumber;

  public service: PlayFabPlayerToolsServiceContract;
  public inventoryService: PlayFabInventoryServiceContract;
  public transactionHistoryService: PlayFabTransactionHistoryServiceContract;

  constructor(
    private readonly playersPlayFabService: WoodstockPlayersPlayFabService,
    private readonly playFabPlayerInventoryService: WoodstockPlayFabPlayerInventoryService,
    private readonly playFabVouchersService: WoodstockPlayFabVouchersService,
  ) {}

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    this.service = {
      gameTitle: GameTitle.FH5,
      getPlayFabProfile$: (xuid: BigNumber) => this.playersPlayFabService.getPlayFabProfile$(xuid),
      inventoryService: {
        gameTitle: GameTitle.FH5,
        getPlayFabCurrencyInventory$: (
          playfabPlayerTitleId: string,
          collectionId: PlayFabCollectionId,
        ) =>
          this.playFabPlayerInventoryService.getCurrencyInventory$(
            playfabPlayerTitleId,
            collectionId,
          ),
        getPlayFabVouchers$: () => this.playFabVouchersService.getVouchers$(),
      },
      transactionHistoryService: {
        gameTitle: GameTitle.FH5,
        getPlayFabTransactionHistory$: (
          playfabPlayerTitleId: string,
          collectionId: PlayFabCollectionId,
        ) =>
          this.playFabPlayerInventoryService.getTransactionHistory$(
            playfabPlayerTitleId,
            collectionId,
          ),
      },
    };
  }
}
