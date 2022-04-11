import { Component, Input } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockService } from '@services/woodstock/woodstock.service';
import { GiftHistoryResultsServiceContract } from '../gift-history-results.component';
import { LspGroup } from '@models/lsp-group';
import { GameTitle } from '@models/enums';
import { DateTime } from 'luxon';

/** Retreives and displays Woodstock Gift history by XUID. */
@Component({
  selector: 'woodstock-gift-history-results',
  templateUrl: './woodstock-gift-history-results.component.html',
})
export class WoodstockGiftHistoryResultsComponent {
  @Input() public selectedPlayer: IdentityResultAlpha;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;
  @Input() public startDate: DateTime;
  @Input() public endDate: DateTime;

  public service: GiftHistoryResultsServiceContract;
  public gameTitle = GameTitle.FH5;

  constructor(woodstockService: WoodstockService) {
    this.service = {
      getGiftHistoryByPlayer$: () =>
        woodstockService.getGiftHistoryByXuid$(
          this.selectedPlayer.xuid,
          this.startDate,
          this.endDate,
        ),
      getGiftHistoryByLspGroup$: () =>
        woodstockService.getGiftHistoryByLspGroup$(
          this.selectedGroup.id,
          this.startDate,
          this.endDate,
        ),
    };
  }
}
