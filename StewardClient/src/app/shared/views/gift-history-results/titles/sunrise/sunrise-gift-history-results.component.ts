import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { SunriseGiftHistories } from '@models/sunrise/sunrise-gift-history.model';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable, of } from 'rxjs';
import { GiftHistoryResultsBaseComponent } from '../../gift-history-results.base.component';

/** Retreives and displays Sunrise Gift history by XUID. */
@Component({
  selector: 'sunrise-gift-history-results',
  templateUrl: './sunrise-gift-history-results.component.html',
  styleUrls: ['../../gift-history-results.base.component.scss']
})
export class SunriseGiftHistoryResultsComponent extends GiftHistoryResultsBaseComponent<IdentityResultAlpha, SunriseGiftHistories>{

  constructor(public readonly sunrise: SunriseService) {
    super();
  }

  public retrieveHistoryByPlayer(): Observable<SunriseGiftHistories>
  {
    return this.sunrise.getGiftHistoryByXuid(this.selectedPlayer.xuid);
  }

  public retrieveHistoryByLspGroup(): Observable<SunriseGiftHistories>
  {
    return this.sunrise.getGiftHistoryByLspGroup(this.selectedGroup.id);
  }
}
