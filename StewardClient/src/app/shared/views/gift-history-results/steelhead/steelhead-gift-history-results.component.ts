import { Component, Input } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadService } from '@services/steelhead/steelhead.service';
import { LspGroup } from '@models/lsp-group';
import { GiftHistoryResultsServiceContract } from '../gift-history-results.component';
import { GameTitle } from '@models/enums';
import { DateTime } from 'luxon';

/** Retreives and displays Steelhead Gift history. */
@Component({
  selector: 'steelhead-gift-history-results',
  templateUrl: './steelhead-gift-history-results.component.html',
})
export class SteelheadGiftHistoryResultsComponent {
  /** REVIEW-COMMENT: Selected player. */
  @Input() public selectedPlayer: IdentityResultAlpha;
  /** REVIEW-COMMENT: Selected lsp group. */
  @Input() public selectedGroup: LspGroup;
  /** REVIEW-COMMENT: Is using player identities. */
  @Input() public usingPlayerIdentities: boolean;
  /** REVIEW-COMMENT: Gift start date. */
  @Input() public startDate: DateTime;
  /** REVIEW-COMMENT: Gift end date. */
  @Input() public endDate: DateTime;

  public service: GiftHistoryResultsServiceContract;
  public gameTitle = GameTitle.FM8;

  constructor(steelheadService: SteelheadService) {
    this.service = {
      getGiftHistoryByPlayer$: () =>
        steelheadService.getGiftHistoryByXuid$(
          this.selectedPlayer.xuid,
          this.startDate,
          this.endDate,
        ),
      getGiftHistoryByLspGroup$: () =>
        steelheadService.getGiftHistoryByLspGroup$(
          this.selectedGroup.id,
          this.startDate,
          this.endDate,
        ),
    };
  }
}
