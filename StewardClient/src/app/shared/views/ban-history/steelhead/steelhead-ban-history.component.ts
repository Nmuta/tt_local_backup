import BigNumber from 'bignumber.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { SteelheadService } from '@services/steelhead/steelhead.service';
import { BanHistoryBaseComponent } from '../ban-history.base.component';
import { Observable } from 'rxjs';
import { LiveOpsBanDescription } from '@models/sunrise';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays Steelhead Ban history by XUID. */
@Component({
  selector: 'steelhead-ban-history',
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
export class SteelheadBanHistoryComponent extends BanHistoryBaseComponent {
  public gameTitle = GameTitleCodeName.FM8;

  constructor(private readonly steelhead: SteelheadService) {
    super();
  }

  /** Gets the Woodstock ban history. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsBanDescription[]> {
    return this.steelhead.getBanHistoryByXuid$(xuid);
  }
}
