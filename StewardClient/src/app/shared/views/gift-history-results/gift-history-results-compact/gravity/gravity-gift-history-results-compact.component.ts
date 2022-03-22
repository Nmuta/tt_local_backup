import { Component, Input } from '@angular/core';
import { IdentityResultBeta } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { GravityService } from '@services/gravity';
import { GiftHistoryResultsServiceContract } from '../../gift-history-results.component';
import { throwError } from 'rxjs';
import { GameTitle } from '@models/enums';
import { GiftHistoryResultAndView } from '@models/gift-history';

/** Retreives and displays Gravity Gift history by XUID. */
@Component({
  selector: 'gravity-gift-history-results-compact',
  templateUrl: './gravity-gift-history-results-compact.component.html',
})
export class GravityGiftHistoryResultsCompactComponent {
  @Input() public selectedPlayer: IdentityResultBeta;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  public service: GiftHistoryResultsServiceContract;
  public gameTitle = GameTitle.Street;
  public giftHistoryList: GiftHistoryResultAndView[];

  constructor(gravity: GravityService) {
    this.service = {
      getGiftHistoryByPlayer$: () => gravity.getGiftHistoryByT10Id$(this.selectedPlayer.t10Id),
      getGiftHistoryByLspGroup$: () => throwError('LSP Group Gifting not supported for Gravity.'),
    };
  }

  /** Logic when gift history list is emited from base results. */
  public foundGiftHistoryList(giftHistoryList: GiftHistoryResultAndView[]): void {
    this.giftHistoryList = giftHistoryList as GiftHistoryResultAndView[];
  }
}
