import BigNumber from 'bignumber.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { LiveOpsBanDescription } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable, throwError } from 'rxjs';
import { BanHistoryBaseComponent } from '../ban-history.base.component';
import { GameTitleCodeName } from '@models/enums';
import { UnbanResult } from '@models/unban-result';
import { PermissionsService } from '@services/permissions';

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

  constructor(private readonly sunrise: SunriseService, permissionsService: PermissionsService) {
    super(permissionsService);
  }

  /** Gets the Sunrise ban history. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsBanDescription[]> {
    return this.sunrise.getBanHistoryByXuid$(xuid);
  }

  /** Expires the Sunrise ban. */
  public expireBan$(_banEntryId: BigNumber): Observable<UnbanResult> {
    return throwError(new Error('Sunrise does not support ban expiration.'));
  }

  /** Deletes the Sunrise ban. */
  public deleteBan$(_banEntryId: BigNumber): Observable<UnbanResult> {
    return throwError(new Error('Sunrise does not support ban deletion.'));
  }
}
