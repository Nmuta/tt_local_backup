import BigNumber from 'bignumber.js';
import { Component, OnChanges } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { WoodstockConsoleDetailsEntry } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock/woodstock.service';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConsolesBaseComponent } from '../consoles.base.component';
import { PermissionsService } from '@services/permissions';

/** Retreives and displays related Woodstock consoles by XUID. */
@Component({
  selector: 'woodstock-consoles',
  templateUrl: '../consoles.component.html',
  styleUrls: ['../consoles.component.scss'],
})
export class WoodstockConsolesComponent
  extends ConsolesBaseComponent<WoodstockConsoleDetailsEntry>
  implements OnChanges {
  public gameTitle = GameTitleCodeName.FH5;
  public supportsConsoleBanning = true;

  constructor(
    private readonly woodstockSerice: WoodstockService,
    permissionsService: PermissionsService,
  ) {
    super(permissionsService);
  }

  /** Gets the console details list from XUID. */
  public getConsoleDetailsByXuid$(xuid: BigNumber): Observable<WoodstockConsoleDetailsEntry[]> {
    return this.woodstockSerice.getConsoleDetailsByXuid$(xuid);
  }

  /** Generates a function that will *ban* the user and update the data when complete. */
  public makeBanAction$(consoleId: string): () => Observable<void> {
    return () =>
      this.woodstockSerice.putBanStatusByConsoleId$(consoleId, true).pipe(
        tap(() => {
          _(this.consoleDetails)
            .filter(d => d.consoleId === consoleId)
            .first().isBanned = true;
        }),
      );
  }

  /** Generates a function that will *unban* the user and update data when complete. */
  public makeUnbanAction$(consoleId: string): () => Observable<void> {
    return () =>
      this.woodstockSerice.putBanStatusByConsoleId$(consoleId, false).pipe(
        tap(() => {
          _(this.consoleDetails)
            .filter(d => d.consoleId === consoleId)
            .first().isBanned = false;
        }),
      );
  }
}
