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
  @Input() public selectedPlayer: IdentityResultAlpha;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;
  @Input() public startDate: DateTime;
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
