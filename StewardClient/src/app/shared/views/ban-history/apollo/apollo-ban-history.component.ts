import BigNumber from 'bignumber.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ApolloService } from '@services/apollo/apollo.service';
import { BanHistoryBaseComponent } from '../ban-history.base.component';
import { Observable } from 'rxjs';
import { LiveOpsBanDescription } from '@models/sunrise';
import { GameTitle } from '@models/enums';
import { UnbanResult } from '@models/unban-result';
import { OldPermissionsService } from '@services/old-permissions';

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
  public gameTitle = GameTitle.FM7;
  public actionsEnabled = true;

  constructor(private readonly apollo: ApolloService, permissionsService: OldPermissionsService) {
    super(permissionsService);
  }

  /** Gets the Apollo ban history. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsBanDescription[]> {
    return this.apollo.getBanHistoryByXuid$(xuid);
  }

  /** Expires the Apollo ban. */
  public expireBan$(banEntryId: BigNumber): Observable<UnbanResult> {
    return this.apollo.expireBan$(banEntryId);
  }

  /** Deletes the Apollo ban. */
  public deleteBan$(banEntryId: BigNumber): Observable<UnbanResult> {
    return this.apollo.deleteBan$(banEntryId);
  }
}
