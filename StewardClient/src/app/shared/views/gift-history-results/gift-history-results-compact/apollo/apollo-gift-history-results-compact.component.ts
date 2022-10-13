import { Component, Input } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { ApolloService } from '@services/apollo/apollo.service';
import { GiftHistoryResultsServiceContract } from '../../gift-history-results.component';
import { GameTitle } from '@models/enums';
import { GiftHistoryResultAndView } from '@models/gift-history';

/** Retreives and displays Apollo Gift history by XUID. */
@Component({
  selector: 'apollo-gift-history-results-compact',
  templateUrl: './apollo-gift-history-results-compact.component.html',
})
export class ApolloGiftHistoryResultsCompactComponent {
  /** REVIEW-COMMENT: Selected player. */
  @Input() public selectedPlayer: IdentityResultAlpha;
  /** REVIEW-COMMENT: Selected group. */
  @Input() public selectedGroup: LspGroup;
  /** REVIEW-COMMENT: Is using player identities. */
  @Input() public usingPlayerIdentities: boolean;

  public service: GiftHistoryResultsServiceContract;
  public gameTitle = GameTitle.FM7;
  public giftHistoryList: GiftHistoryResultAndView[];

  constructor(apolloService: ApolloService) {
    this.service = {
      getGiftHistoryByPlayer$: () => apolloService.getGiftHistoryByXuid$(this.selectedPlayer.xuid),
      getGiftHistoryByLspGroup$: () =>
        apolloService.getGiftHistoryByLspGroup$(this.selectedGroup.id),
    };
  }

  /** Logic when gift history list is emited from base results. */
  public foundGiftHistoryList(giftHistoryList: GiftHistoryResultAndView[]): void {
    this.giftHistoryList = giftHistoryList;
  }
}
