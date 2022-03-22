import { Component, Input } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { ApolloService } from '@services/apollo/apollo.service';
import { GiftHistoryResultsServiceContract } from '../gift-history-results.component';
import { GameTitle } from '@models/enums';

/** Retreives and displays Apollo Gift history by XUID. */
@Component({
  selector: 'apollo-gift-history-results',
  templateUrl: './apollo-gift-history-results.component.html',
})
export class ApolloGiftHistoryResultsComponent {
  @Input() public selectedPlayer: IdentityResultAlpha;
  @Input() public selectedGroup: LspGroup;
  @Input() public usingPlayerIdentities: boolean;

  public service: GiftHistoryResultsServiceContract;
  public gameTitle = GameTitle.FM7;

  constructor(apolloService: ApolloService) {
    this.service = {
      getGiftHistoryByPlayer$: () => apolloService.getGiftHistoryByXuid$(this.selectedPlayer.xuid),
      getGiftHistoryByLspGroup$: () =>
        apolloService.getGiftHistoryByLspGroup$(this.selectedGroup.id),
    };
  }
}
