import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { GravityGiftHistories } from '@models/gravity/gravity-gift-history.model';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GravityService } from '@services/gravity';
import { Observable, of, throwError } from 'rxjs';
import { GiftHistoryResultsBaseComponent } from '../../gift-history-results.base.component';

/** Retreives and displays Gravity Gift history by XUID. */
@Component({
  selector: 'gravity-gift-history-results',
  templateUrl: './gravity-gift-history-results.component.html',
  styleUrls: ['../../gift-history-results.base.component.scss']
})
export class GravityGiftHistoryResultsComponent extends GiftHistoryResultsBaseComponent<IdentityResultBeta, GravityGiftHistories>{

  constructor(public readonly gravity: GravityService) {
    super();
  }

  public retrieveHistoryByPlayer(): Observable<GravityGiftHistories>
  {
    return this.gravity.getGiftHistoryByT10Id(this.selectedPlayer.t10Id);
  }

  public retrieveHistoryByLspGroup(): Observable<GravityGiftHistories>
  {
    return throwError("LSP Group Gifting not supported for Gravity.");
  }
}
