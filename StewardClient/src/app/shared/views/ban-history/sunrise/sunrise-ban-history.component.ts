import BigNumber from 'bignumber.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { LiveOpsBanDescription } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import { BanHistoryBaseComponent } from '../ban-history.base.component';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays Sunrise Ban history by XUID. */
@Component({
  selector: 'sunrise-ban-history',
  templateUrl: '../ban-history.component.html',
  styleUrls: ['../ban-history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SunriseBanHistoryComponent extends BanHistoryBaseComponent {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunrise: SunriseService) {
    super();
  }

  /** Gets the Woodstock ban history. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsBanDescription[]> {
    return this.sunrise.getBanHistoryByXuid$(xuid);
  }
}
