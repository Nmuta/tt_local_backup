import { Component, Input } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { GiftHistoryResultsServiceContract } from '../../gift-history-results.component';
import { LspGroup } from '@models/lsp-group';
import { GameTitle } from '@models/enums';
import { GiftHistoryResultAndView } from '@models/gift-history';

/** Retreives and displays Sunrise Gift history by XUID. */
@Component({
  selector: 'sunrise-gift-history-results-compact',
  templateUrl: './sunrise-gift-history-results-compact.component.html',
})
export class SunriseGiftHistoryResultsCompactComponent {
  @Input() public selectedPlayer: IdentityResultAlpha;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  public service: GiftHistoryResultsServiceContract;
  public gameTitle = GameTitle.FH4;
  public giftHistoryList: GiftHistoryResultAndView[];

  constructor(sunriseService: SunriseService) {
    this.service = {
      getGiftHistoryByPlayer$: () => sunriseService.getGiftHistoryByXuid$(this.selectedPlayer.xuid),
      getGiftHistoryByLspGroup$: () =>
        sunriseService.getGiftHistoryByLspGroup$(this.selectedGroup.id),
    };
  }

  /** Logic when gift history list is emited from base results. */
  public foundGiftHistoryList(giftHistoryList: GiftHistoryResultAndView[]): void {
    this.giftHistoryList = giftHistoryList as GiftHistoryResultAndView[];
  }
}
