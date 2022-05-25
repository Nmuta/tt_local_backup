import BigNumber from 'bignumber.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ApolloService } from '@services/apollo/apollo.service';
import { BanHistoryBaseComponent } from '../ban-history.base.component';
import { Observable, throwError } from 'rxjs';
import { LiveOpsBanDescription } from '@models/sunrise';
import { GameTitleCodeName } from '@models/enums';
import { UnbanResult } from '@models/unban-result';
import { PermissionsService } from '@services/permissions';

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

  constructor(private readonly apollo: ApolloService, permissionsService: PermissionsService) {
    super(permissionsService);
  }

  /** Gets the Apollo ban history. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsBanDescription[]> {
    return this.apollo.getBanHistoryByXuid$(xuid);
  }

  /** Expires the Apollo ban. */
  public expireBan$(_banEntryId: BigNumber): Observable<UnbanResult> {
    return throwError(new Error('Apollo does not support ban expiration.'));
  }

  /** Deletes the Apollo ban. */
  public deleteBan$(_banEntryId: BigNumber): Observable<UnbanResult> {
    return throwError(new Error('Apollo does not support ban deletion.'));
  }
}
