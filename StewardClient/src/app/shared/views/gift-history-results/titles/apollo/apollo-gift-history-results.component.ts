import { Component } from '@angular/core';
import { ApolloGiftHistory } from '@models/apollo/apollo-gift-history.model';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ApolloService } from '@services/apollo/apollo.service';
import { Observable } from 'rxjs';
import { GiftHistoryResultsBaseComponent } from '../../gift-history-results.base.component';

/** Retreives and displays Apollo Gift history by XUID. */
@Component({
  selector: 'apollo-gift-history-results',
  templateUrl: './apollo-gift-history-results.component.html',
  styleUrls: ['../../gift-history-results.base.component.scss'],
})
export class ApolloGiftHistoryResultsComponent extends GiftHistoryResultsBaseComponent<
  IdentityResultAlpha,
  ApolloGiftHistory[]
> {
  constructor(public readonly apolloService: ApolloService) {
    super();
  }

  /** Reteives the gift history of the player. */
  public retrieveHistoryByPlayer(): Observable<ApolloGiftHistory[]> {
    return this.apolloService.getGiftHistoryByXuid(this.selectedPlayer.xuid);
  }

  /** Reteives the gift history of a LSP group. */
  public retrieveHistoryByLspGroup(): Observable<ApolloGiftHistory[]> {
    return this.apolloService.getGiftHistoryByLspGroup(this.selectedGroup.id);
  }
}
