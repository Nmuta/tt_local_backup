import { Component, Input } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadService } from '@services/steelhead/steelhead.service';
import { LspGroup } from '@models/lsp-group';
import { GiftHistoryResultsServiceContract } from '../../gift-history-results.component';
import { GameTitle } from '@models/enums';
import { GiftHistoryResultAndView } from '@models/gift-history';

/** Retreives and displays Steelhead Gift history. */
@Component({
  selector: 'steelhead-gift-history-results-compact',
  templateUrl: './steelhead-gift-history-results-compact.component.html',
})
export class SteelheadGiftHistoryResultsCompactComponent {
  /** REVIEW-COMMENT: Selected player. */
  @Input() public selectedPlayer: IdentityResultAlpha;
  /** REVIEW-COMMENT: Selected group. */
  @Input() public selectedGroup: LspGroup;
  /** REVIEW-COMMENT: Is using player identities. */
  @Input() public usingPlayerIdentities: boolean;

  public service: GiftHistoryResultsServiceContract;
  public gameTitle = GameTitle.FM8;
  public giftHistoryList: GiftHistoryResultAndView[];

  constructor(steelheadService: SteelheadService) {
    this.service = {
      getGiftHistoryByPlayer$: () =>
        steelheadService.getGiftHistoryByXuid$(this.selectedPlayer.xuid),
      getGiftHistoryByLspGroup$: () =>
        steelheadService.getGiftHistoryByLspGroup$(this.selectedGroup.id),
    };
  }

  /** Logic when gift history list is emited from base results. */
  public foundGiftHistoryList(giftHistoryList: GiftHistoryResultAndView[]): void {
    this.giftHistoryList = giftHistoryList as GiftHistoryResultAndView[];
  }
}
