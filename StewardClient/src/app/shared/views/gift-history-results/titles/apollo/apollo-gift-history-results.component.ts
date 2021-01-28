import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ApolloGiftHistories } from '@models/apollo/apollo-gift-history.model';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { ApolloService } from '@services/apollo/apollo.service';
import { Observable, of, throwError } from 'rxjs';
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

    //return throwError("LSP Group Gifting not supported for Gravity.");
    return this.apollo.getGiftHistoryByLspGroup(this.selectedGroup.id);
  }
}
