import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ApolloGiftHistories } from '@models/apollo/apollo-gift-history.model';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ApolloService } from '@services/apollo/apollo.service';
import { Observable, of } from 'rxjs';
import { GiftHistoryResultsBaseComponent } from '../../gift-history-results.base.component';

/** Retreives and displays Apollo Gift history by XUID. */
@Component({
  selector: 'apollo-gift-history-results',
  templateUrl: './apollo-gift-history-results.component.html',
  styleUrls: ['./apollo-gift-history-results.component.scss']
})
export class ApolloGiftHistoryResultsComponent extends GiftHistoryResultsBaseComponent<IdentityResultAlpha, ApolloGiftHistories>{

  constructor(public readonly apollo: ApolloService) {
    super();
  }

  public retrieveHistoryByPlayer(): Observable<ApolloGiftHistories>
  {
    if(this.selectedPlayer === undefined) {
      return of([]);
    }

    return this.apollo.getGiftHistoryByXuid(this.selectedPlayer.xuid);
  }

  public retrieveHistoryByLspGroup(): Observable<ApolloGiftHistories>
  {
    if(this.selectedGroup === undefined || this.selectedGroup === null) {
      return of([]);
    }

    return this.apollo.getGiftHistoryByLspGroup(this.selectedGroup.id);
  }
}
