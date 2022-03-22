import { Component, Input } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadService } from '@services/steelhead/steelhead.service';
import { LspGroup } from '@models/lsp-group';
import { GiftHistoryResultsServiceContract } from '../gift-history-results.component';
import { GameTitle } from '@models/enums';

/** Retreives and displays Steelhead Gift history. */
@Component({
  selector: 'steelhead-gift-history-results',
  templateUrl: './steelhead-gift-history-results.component.html',
})
export class SteelheadGiftHistoryResultsComponent {
  @Input() public selectedPlayer: IdentityResultAlpha;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  public service: GiftHistoryResultsServiceContract;
  public gameTitle = GameTitle.FM8;

  constructor(steelheadService: SteelheadService) {
    this.service = {
      getGiftHistoryByPlayer$: () =>
        steelheadService.getGiftHistoryByXuid$(this.selectedPlayer.xuid),
      getGiftHistoryByLspGroup$: () =>
        steelheadService.getGiftHistoryByLspGroup$(this.selectedGroup.id),
    };
  }
}
