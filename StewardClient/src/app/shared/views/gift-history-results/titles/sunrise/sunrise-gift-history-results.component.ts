import { Component } from '@angular/core';
import { SunriseGiftHistory } from '@models/sunrise/sunrise-gift-history.model';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import { GiftHistoryResultsBaseComponent } from '../../gift-history-results.base.component';

/** Retreives and displays Sunrise Gift history by XUID. */
@Component({
  selector: 'sunrise-gift-history-results',
  templateUrl: './sunrise-gift-history-results.component.html',
  styleUrls: ['../../gift-history-results.base.component.scss'],
})
export class SunriseGiftHistoryResultsComponent extends GiftHistoryResultsBaseComponent<
  IdentityResultAlpha,
  SunriseGiftHistory[]
> {
  constructor(public readonly sunrise: SunriseService) {
    super();
  }

  /** Reteives the gift history of the player. */
  public retrieveHistoryByPlayer(): Observable<SunriseGiftHistory[]> {
    return this.sunrise.getGiftHistoryByXuid(this.selectedPlayer.xuid);
  }

  /** Reteives the gift history of a LSP group. */
  public retrieveHistoryByLspGroup(): Observable<SunriseGiftHistory[]> {
    return this.sunrise.getGiftHistoryByLspGroup(this.selectedGroup.id);
  }
}
