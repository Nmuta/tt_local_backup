import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SunriseProfileSummary } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { ProfileOverviewBaseComponent } from '../overview.base.component';
import { Observable } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';

/** Retrieves and displays Sunrise Overview by XUID. */
@Component({
  selector: 'sunrise-overview',
  templateUrl: '../overview.component.html',
  styleUrls: ['../overview.component.scss'],
})
export class SunriseOverviewComponent extends ProfileOverviewBaseComponent<SunriseProfileSummary> {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Gets a Sunrise player's profile overview. */
  public getProfileSummaryByXuid$(xuid: BigNumber): Observable<SunriseProfileSummary> {
    return this.sunrise.getProfileSummaryByXuid$(xuid);
  }
}
