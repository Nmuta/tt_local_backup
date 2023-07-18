import BigNumber from 'bignumber.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { LiveOpsBanDescription } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import { BanHistoryBaseComponent } from '../ban-history.base.component';
import { GameTitle } from '@models/enums';
import { UnbanResult } from '@models/unban-result';
import { OldPermissionsService } from '@services/old-permissions';
import { MultipleBanHistoryService } from '@services/api-v2/all/player/ban-history.service';

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
  public gameTitle = GameTitle.FH4;
  public actionsEnabled = true;

  constructor(
    private readonly sunrise: SunriseService,
    permissionsService: OldPermissionsService,
    multipleBanHistoryService: MultipleBanHistoryService,
  ) {
    super(permissionsService, multipleBanHistoryService);
  }

  /** Gets the Sunrise ban history. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsBanDescription[]> {
    return this.sunrise.getBanHistoryByXuid$(xuid);
  }

  /** Expires the Sunrise ban. */
  public expireBan$(banEntryId: BigNumber): Observable<UnbanResult> {
    return this.sunrise.expireBan$(banEntryId);
  }

  /** Deletes the Sunrise ban. */
  public deleteBan$(banEntryId: BigNumber): Observable<UnbanResult> {
    return this.sunrise.deleteBan$(banEntryId);
  }
}
