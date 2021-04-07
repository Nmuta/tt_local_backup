import { Component } from '@angular/core';
import { SunriseUserFlags } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import { UserFlagsBaseComponent } from '../user-flags.base.component';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays Sunrise User Flags by XUID. */
@Component({
  selector: 'sunrise-user-flags',
  templateUrl: './sunrise-user-flags.component.html',
  styleUrls: ['../user-flags.component.scss'],
})
export class SunriseUserFlagsComponent extends UserFlagsBaseComponent<SunriseUserFlags> {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunriseService: SunriseService) {
    super();
  }

  /** Gets Sunrise user flags. */
  public getFlagsByXuid(xuid: bigint): Observable<SunriseUserFlags> {
    return this.sunriseService.getFlagsByXuid(xuid);
  }

  /** Sets the newly selected Sunrise flags. */
  public putFlagsByXuid(xuid: bigint, newFlags: SunriseUserFlags): Observable<SunriseUserFlags> {
    return this.sunriseService.putFlagsByXuid(xuid, newFlags);
  }
}
