import BigNumber from 'bignumber.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ApolloService } from '@services/apollo/apollo.service';
import { BanHistoryBaseComponent } from '../ban-history.base.component';
import { Observable } from 'rxjs';
import { LiveOpsBanDescription } from '@models/sunrise';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays Apollo Ban history by XUID. */
@Component({
  selector: 'apollo-ban-history',
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
export class ApolloBanHistoryComponent extends BanHistoryBaseComponent {
  public gameTitle = GameTitleCodeName.FM7;

  constructor(private readonly apollo: ApolloService) {
    super();
  }

  /** Gets the Woodstock ban history. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsBanDescription[]> {
    return this.apollo.getBanHistoryByXuid$(xuid);
  }
}
