import { Component } from '@angular/core';
import { GravityGiftHistory } from '@models/gravity/gravity-gift-history.model';
import { IdentityResultBeta } from '@models/identity-query.model';
import { GravityService } from '@services/gravity';
import { Observable, throwError } from 'rxjs';
import { GiftHistoryResultsBaseComponent } from '../../gift-history-results.base.component';

/** Retreives and displays Gravity Gift history by XUID. */
@Component({
  selector: 'gravity-gift-history-results',
  templateUrl: './gravity-gift-history-results.component.html',
  styleUrls: ['../../gift-history-results.base.component.scss'],
})
export class GravityGiftHistoryResultsComponent extends GiftHistoryResultsBaseComponent<
  IdentityResultBeta,
  GravityGiftHistory[]
> {
  constructor(public readonly gravity: GravityService) {
    super();
  }

  /** Reteives the gift history of the player. */
  public retrieveHistoryByPlayer(): Observable<GravityGiftHistory[]> {
    return this.gravity.getGiftHistoryByT10Id(this.selectedPlayer.t10Id);
  }

  /** Reteives the gift history of a LSP group. */
  public retrieveHistoryByLspGroup(): Observable<GravityGiftHistory[]> {
    return throwError('LSP Group Gifting not supported for Gravity.');
  }
}
