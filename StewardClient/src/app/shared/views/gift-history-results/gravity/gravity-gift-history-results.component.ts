import { Component, Input } from '@angular/core';
import { IdentityResultBeta } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { GravityService } from '@services/gravity';
import { GiftHistoryResultsServiceContract } from '../gift-history-results.component';
import { GameTitle } from '@models/enums';

/** Retreives and displays Gravity Gift history by XUID. */
@Component({
  selector: 'gravity-gift-history-results',
  templateUrl: './gravity-gift-history-results.component.html',
})
export class GravityGiftHistoryResultsComponent {
  @Input() public selectedPlayer: IdentityResultBeta;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  public service: GiftHistoryResultsServiceContract;
  public gameTitle = GameTitle.Street;

  constructor(gravity: GravityService) {
    this.service = {
      getGiftHistoryByPlayer$: () => gravity.getGiftHistoryByT10Id$(this.selectedPlayer.t10Id),
    };
  }
}
