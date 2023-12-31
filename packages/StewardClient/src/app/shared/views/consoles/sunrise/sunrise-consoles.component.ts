import BigNumber from 'bignumber.js';
import { Component, OnChanges } from '@angular/core';
import { GameTitle } from '@models/enums';
import { SunriseConsoleDetailsEntry } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import _ from 'lodash';
import { Observable } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { ConsolesBaseComponent } from '../consoles.base.component';
import { OldPermissionsService } from '@services/old-permissions';

/** Retreives and displays related Sunrise consoles by XUID. */
@Component({
  selector: 'sunrise-consoles',
  templateUrl: '../consoles.component.html',
  styleUrls: ['../consoles.component.scss'],
})
export class SunriseConsolesComponent
  extends ConsolesBaseComponent<SunriseConsoleDetailsEntry>
  implements OnChanges
{
  public gameTitle = GameTitle.FH4;
  public supportsConsoleBanning = true;

  constructor(
    private readonly sunriseSerice: SunriseService,
    permissionsService: OldPermissionsService,
  ) {
    super(permissionsService);
  }

  /** Gets the console details list from XUID. */
  public getConsoleDetailsByXuid$(xuid: BigNumber): Observable<SunriseConsoleDetailsEntry[]> {
    return this.sunriseSerice.getConsoleDetailsByXuid$(xuid);
  }

  /** Generates a function that will *ban* the user and update the data when complete. */
  public makeBanAction$(consoleId: string): Observable<void> {
    return this.sunriseSerice.putBanStatusByConsoleId$(consoleId, true).pipe(
      tap(() => {
        _(this.consoleDetails.data)
          .filter(d => d.consoleId === consoleId)
          .first().isBanned = true;
      }),
      takeUntil(this.onDestroy$),
    );
  }

  /** Generates a function that will *unban* the user and update data when complete. */
  public makeUnbanAction$(consoleId: string): Observable<void> {
    return this.sunriseSerice.putBanStatusByConsoleId$(consoleId, false).pipe(
      tap(() => {
        _(this.consoleDetails.data)
          .filter(d => d.consoleId === consoleId)
          .first().isBanned = false;
      }),
      takeUntil(this.onDestroy$),
    );
  }
}
