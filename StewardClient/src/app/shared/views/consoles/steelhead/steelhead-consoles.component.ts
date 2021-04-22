import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SteelheadConsoleDetailsEntry } from '@models/steelhead';
import { GameTitleCodeName } from '@models/enums';
import { SteelheadService } from '@services/steelhead';
import { Observable } from 'rxjs';
import { ConsolesBaseComponent } from '../consoles.base.component';

/** Retreives and displays related Sunrise consoles by XUID. */
@Component({
  selector: 'steelhead-consoles',
  templateUrl: '../consoles.component.html',
  styleUrls: ['../consoles.component.scss'],
})
export class SteelheadConsolesComponent extends ConsolesBaseComponent<
  SteelheadConsoleDetailsEntry
> {
  public gameTitle = GameTitleCodeName.FM8;
  public supportsConsoleBanning = false;

  constructor(private readonly steelheadService: SteelheadService) {
    super();
  }

  /** Gets the console details list from XUID. */
  public getConsoleDetailsByXuid(xuid: BigNumber): Observable<SteelheadConsoleDetailsEntry[]> {
    return this.steelheadService.getConsoleDetailsByXuid(xuid);
  }
}
