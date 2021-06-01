import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { WoodstockProfileSummary } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock/woodstock.service';
import { ProfileOverviewBaseComponent } from '../overview.base.component';
import { GameTitleCodeName } from '@models/enums';
import { Observable } from 'rxjs';

/** Retrieves and displays Woodstock Overview by XUID. */
@Component({
  selector: 'woodstock-overview',
  templateUrl: '../overview.component.html',
  styleUrls: ['../overview.component.scss'],
})
export class WoodstockOverviewComponent extends ProfileOverviewBaseComponent<
  WoodstockProfileSummary
> {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(private readonly woodstock: WoodstockService) {
    super();
  }

  /** Gets a Woodstock player's profile overview. */
  public getProfileSummaryByXuid$(xuid: BigNumber): Observable<WoodstockProfileSummary> {
    return this.woodstock.getProfileSummaryByXuid$(xuid);
  }
}
