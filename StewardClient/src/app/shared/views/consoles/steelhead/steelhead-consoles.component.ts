import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SteelheadConsoleDetailsEntry } from '@models/steelhead';
import { GameTitleCodeName } from '@models/enums';
import { SteelheadService } from '@services/steelhead';
import { Observable, throwError } from 'rxjs';
import { ConsolesBaseComponent } from '../consoles.base.component';
import { PermissionsService } from '@services/permissions';

/** Retreives and displays related Sunrise consoles by XUID. */
@Component({
  selector: 'steelhead-consoles',
  templateUrl: '../consoles.component.html',
  styleUrls: ['../consoles.component.scss'],
})
export class SteelheadConsolesComponent extends ConsolesBaseComponent<SteelheadConsoleDetailsEntry> {
  public gameTitle = GameTitleCodeName.FM8;
  public supportsConsoleBanning = false;

  constructor(
    private readonly steelheadService: SteelheadService,
    permissionsService: PermissionsService,
  ) {
    super(permissionsService);
  }

  /** Gets the console details list from XUID. */
  public getConsoleDetailsByXuid$(xuid: BigNumber): Observable<SteelheadConsoleDetailsEntry[]> {
    return this.steelheadService.getConsoleDetailsByXuid$(xuid);
  }

  /** Generates a function that will *ban* the user and update the data when complete. */
  public makeBanAction$(_consoleId: string): () => Observable<void> {
    return () => throwError(new Error('Steelhead does not support console banning.'));
  }

  /** Generates a function that will *unban* the user and update data when complete. */
  public makeUnbanAction$(_consoleId: string): () => Observable<void> {
    return () => throwError(new Error('Steelhead does not support console banning.'));
  }
}
