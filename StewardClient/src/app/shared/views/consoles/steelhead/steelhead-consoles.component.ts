import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SteelheadConsoleDetailsEntry } from '@models/steelhead';
import { GameTitleCodeName } from '@models/enums';
import { Observable, tap } from 'rxjs';
import _ from 'lodash';
import { ConsolesBaseComponent } from '../consoles.base.component';
import { PermissionsService } from '@services/permissions';
import { SteelheadPlayerConsolesService } from '@services/api-v2/steelhead/player/consoles/steelhead-player-consoles.service';
import { SteelheadConsolesService } from '@services/api-v2/steelhead/consoles/steelhead-consoles.service';

/** Retreives and displays related Sunrise consoles by XUID. */
@Component({
  selector: 'steelhead-consoles',
  templateUrl: '../consoles.component.html',
  styleUrls: ['../consoles.component.scss'],
})
export class SteelheadConsolesComponent extends ConsolesBaseComponent<SteelheadConsoleDetailsEntry> {
  public gameTitle = GameTitleCodeName.FM8;
  public supportsConsoleBanning = true;

  constructor(
    private readonly steelheadPlayerConsolesService: SteelheadPlayerConsolesService,
    private readonly steelheadConsolesService: SteelheadConsolesService,
    permissionsService: PermissionsService,
  ) {
    super(permissionsService);
  }

  /** Gets the console details list from XUID. */
  public getConsoleDetailsByXuid$(xuid: BigNumber): Observable<SteelheadConsoleDetailsEntry[]> {
    return this.steelheadPlayerConsolesService.getConsoleDetailsByXuid$(xuid);
  }

  /** Generates a function that will *ban* the user and update the data when complete. */
  public makeBanAction$(consoleId: string): () => Observable<void> {
    return () =>
      this.steelheadConsolesService.putBanStatusByConsoleId$(consoleId, true).pipe(
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
      this.steelheadConsolesService.putBanStatusByConsoleId$(consoleId, false).pipe(
        tap(() => {
          _(this.consoleDetails)
            .filter(d => d.consoleId === consoleId)
            .first().isBanned = false;
        }),
      );
  }
}
