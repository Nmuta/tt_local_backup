import BigNumber from 'bignumber.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { BanHistoryBaseComponent } from '../ban-history.base.component';
import { Observable } from 'rxjs';
import { LiveOpsBanDescription } from '@models/sunrise';
import { GameTitle } from '@models/enums';
import { UnbanResult } from '@models/unban-result';
import { OldPermissionsService } from '@services/old-permissions';
import { SteelheadBanHistoryService } from '@services/api-v2/steelhead/player/ban-history/steelhead-ban-history.service';
import { SteelheadBanService } from '@services/api-v2/steelhead/ban/steelhead-ban.service';

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
  public gameTitle = GameTitle.FM8;
  public actionsEnabled = true;

  constructor(
    private readonly steelheadBanHistoryService: SteelheadBanHistoryService,
    private readonly steelheadBanService: SteelheadBanService,
    permissionsService: OldPermissionsService,
  ) {
    super(permissionsService);
  }

  /** Gets the Steelhead ban history. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsBanDescription[]> {
    return this.steelheadBanHistoryService.getBanHistoryByXuid$(xuid);
  }

  /** Expires the Steelhead ban. */
  public expireBan$(banEntryId: BigNumber): Observable<UnbanResult> {
    return this.steelheadBanService.expireBan$(banEntryId);
  }

  /** Deletes the Steelhead ban. */
  public deleteBan$(banEntryId: BigNumber): Observable<UnbanResult> {
    return this.steelheadBanService.deleteBan$(banEntryId);
  }
}
