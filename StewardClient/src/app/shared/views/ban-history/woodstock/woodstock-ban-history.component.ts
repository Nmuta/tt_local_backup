import BigNumber from 'bignumber.js';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { LiveOpsExtendedBanDescription } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock/woodstock.service';
import { BanHistoryBaseComponent } from '../ban-history.base.component';
import { Observable } from 'rxjs';
import { GameTitle } from '@models/enums';
import { UnbanResult } from '@models/unban-result';
import { PermissionsService } from '@services/permissions';

/** Retreives and displays Woodstock Ban history by XUID. */
@Component({
  selector: 'woodstock-ban-history',
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
export class WoodstockBanHistoryComponent extends BanHistoryBaseComponent {
  public gameTitle = GameTitle.FH5;
  public actionsEnabled = true;

  constructor(
    private readonly woodstock: WoodstockService,
    permissionsService: PermissionsService,
  ) {
    super(permissionsService);
  }

  /** Gets the Woodstock ban history. */
  public getBanHistoryByXuid$(xuid: BigNumber): Observable<LiveOpsExtendedBanDescription[]> {
    return this.woodstock.getBanHistoryByXuid$(xuid);
  }

  /** Expires the Woodstock ban. */
  public expireBan$(banEntryId: BigNumber): Observable<UnbanResult> {
    return this.woodstock.expireBan$(banEntryId);
  }

  /** Deletes the Woodstock ban. */
  public deleteBan$(banEntryId: BigNumber): Observable<UnbanResult> {
    return this.woodstock.deleteBan$(banEntryId);
  }
}
