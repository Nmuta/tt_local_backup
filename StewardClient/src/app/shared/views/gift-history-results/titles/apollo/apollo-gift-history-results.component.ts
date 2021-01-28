import { Component } from '@angular/core';
import { ApolloGiftHistories } from '@models/apollo/apollo-gift-history.model';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ApolloService } from '@services/apollo/apollo.service';
import { Observable } from 'rxjs';
import { GiftHistoryResultsBaseComponent } from '../../gift-history-result.base.component';

/** Retreives and displays Apollo Gift history by XUID. */
@Component({
  selector: 'apollo-gift-history-results',
  templateUrl: './apollo-gift-history-results.component.html',
  styleUrls: ['./apollo-gift-history-results.component.scss']
})
export class ApolloGiftHistoryResultsComponent extends GiftHistoryResultsBaseComponent<IdentityResultAlpha, ApolloGiftHistories>{

  /** The gift history list to display. */
  public giftHistoryList: ApolloGiftHistories;
  
  constructor(public readonly apolloService: ApolloService) {
    super();
  }

  /** Reteives the gift history of the player. */
  public retrieveHistoryByPlayer(): Observable<ApolloGiftHistories> {
    return this.apolloService.getGiftHistoryByXuid(this.selectedPlayer.xuid);
  }

  /** Reteives the gift history of a LSP group. */
  public retrieveHistoryByLspGroup(): Observable<ApolloGiftHistories> {
    //return throwError("LSP Group Gifting not supported for Gravity.");
    return this.apolloService.getGiftHistoryByLspGroup(this.selectedGroup.id);
  }
}
