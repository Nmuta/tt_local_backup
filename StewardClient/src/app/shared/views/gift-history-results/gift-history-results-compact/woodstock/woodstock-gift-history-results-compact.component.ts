import { Component, Input } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockService } from '@services/woodstock/woodstock.service';
import { GiftHistoryResultsServiceContract } from '../../gift-history-results.component';
import { LspGroup } from '@models/lsp-group';
import { GameTitle } from '@models/enums';
import { GiftHistoryResultAndView } from '@models/gift-history';

/** Retreives and displays Woodstock Gift history by XUID. */
@Component({
  selector: 'woodstock-gift-history-results-compact',
  templateUrl: './woodstock-gift-history-results-compact.component.html',
})
export class WoodstockGiftHistoryResultsCompactComponent {
  @Input() public selectedPlayer: IdentityResultAlpha;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  public service: GiftHistoryResultsServiceContract;
  public gameTitle = GameTitle.FH5;
  public giftHistoryList: GiftHistoryResultAndView[];

  constructor(woodstockService: WoodstockService) {
    this.service = {
      getGiftHistoryByPlayer$: () =>
        woodstockService.getGiftHistoryByXuid$(this.selectedPlayer.xuid),
      getGiftHistoryByLspGroup$: () =>
        woodstockService.getGiftHistoryByLspGroup$(this.selectedGroup.id),
    };
  }

  /** Logic when gift history list is emited from base results. */
  public foundGiftHistoryList(giftHistoryList: GiftHistoryResultAndView[]): void {
    this.giftHistoryList = giftHistoryList as GiftHistoryResultAndView[];
  }
}
