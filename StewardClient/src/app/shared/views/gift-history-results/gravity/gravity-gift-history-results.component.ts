import { Component, Input } from '@angular/core';
import { IdentityResultBeta } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { GravityService } from '@services/gravity';
import { GiftHistoryResultsServiceContract } from '../gift-history-results.component';
import { GameTitle } from '@models/enums';
import { DateTime } from 'luxon';

/** Retreives and displays Gravity Gift history by XUID. */
@Component({
  selector: 'gravity-gift-history-results',
  templateUrl: './gravity-gift-history-results.component.html',
})
export class GravityGiftHistoryResultsComponent {
  /** REVIEW-COMMENT: Selected player. */
  @Input() public selectedPlayer: IdentityResultBeta;
  /** REVIEW-COMMENT: Selected lsp group. */
  @Input() public selectedGroup: LspGroup;
  /** REVIEW-COMMENT: Is using player identities. */
  @Input() public usingPlayerIdentities: boolean;
  /** REVIEW-COMMENT: Gift start date. */
  @Input() public startDate: DateTime;
  /** REVIEW-COMMENT: Gift end date. */
  @Input() public endDate: DateTime;

  public service: GiftHistoryResultsServiceContract;
  public gameTitle = GameTitle.Street;

  constructor(gravity: GravityService) {
    this.service = {
      getGiftHistoryByPlayer$: () =>
        gravity.getGiftHistoryByT10Id$(this.selectedPlayer.t10Id, this.startDate, this.endDate),
    };
  }
}
