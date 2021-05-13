import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { UserFlagsBaseComponent } from '../user-flags.base.component';
import { GameTitleCodeName } from '@models/enums';
import { SteelheadService } from '@services/steelhead';
import { SteelheadUserFlags } from '@models/steelhead';

/** Retreives and displays Sunrise User Flags by XUID. */
@Component({
  selector: 'steelhead-user-flags',
  templateUrl: './steelhead-user-flags.component.html',
  styleUrls: ['../user-flags.component.scss'],
})
export class SteelheadUserFlagsComponent extends UserFlagsBaseComponent<SteelheadUserFlags> {
  public gameTitle = GameTitleCodeName.FM7;

  constructor(private readonly steelheadService: SteelheadService) {
    super();
  }

  /** Gets Steelhead user flags. */
  public getFlagsByXuid$(xuid: BigNumber): Observable<SteelheadUserFlags> {
    return this.steelheadService.getFlagsByXuid$(xuid);
  }

  /** Sets the newly selected Steelhead flags. */
  public putFlagsByXuid$(
    xuid: BigNumber,
    newFlags: SteelheadUserFlags,
  ): Observable<SteelheadUserFlags> {
    return this.steelheadService.putFlagsByXuid$(xuid, newFlags);
  }
}
