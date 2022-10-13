import { Component, Input } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { GiftHistoryResultsServiceContract } from '../gift-history-results.component';
import { LspGroup } from '@models/lsp-group';
import { GameTitle } from '@models/enums';
import { DateTime } from 'luxon';

/** Retreives and displays Sunrise Gift history by XUID. */
@Component({
  selector: 'sunrise-gift-history-results',
  templateUrl: './sunrise-gift-history-results.component.html',
})
export class SunriseGiftHistoryResultsComponent {
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
  public gameTitle = GameTitle.FH4;

  constructor(sunriseService: SunriseService) {
    this.service = {
      getGiftHistoryByPlayer$: () =>
        sunriseService.getGiftHistoryByXuid$(
          this.selectedPlayer.xuid,
          this.startDate,
          this.endDate,
        ),
      getGiftHistoryByLspGroup$: () =>
        sunriseService.getGiftHistoryByLspGroup$(
          this.selectedGroup.id,
          this.startDate,
          this.endDate,
        ),
    };
  }
}
