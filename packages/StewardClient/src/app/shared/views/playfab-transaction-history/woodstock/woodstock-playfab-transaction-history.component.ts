import { Component, Input, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { PlayFabTransactionHistoryServiceContract } from '../playfab-transaction-history.component';
import { WoodstockPlayFabPlayerTransactionsService } from '@services/api-v2/woodstock/playfab/player/transactions/woodstock-playfab-player-transactions.service';

/**
 *  Woodstock cms override component.
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
    private readonly playfabTransactionService: WoodstockPlayFabPlayerTransactionsService,
  ) {}

  /** Lifecycle hook. */
  public ngOnChanges(): void {
    this.service = {
      gameTitle: GameTitle.FH5,
      getPlayFabTransactionHistory$: (playfabPlayerTitleId: string) =>
        this.playfabTransactionService.getHistory$(playfabPlayerTitleId),
    };
  }
}
