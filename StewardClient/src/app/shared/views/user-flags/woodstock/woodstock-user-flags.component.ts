import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { WoodstockUserFlags } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock/woodstock.service';
import { Observable } from 'rxjs';
import { UserFlagsBaseComponent } from '../user-flags.base.component';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays Woodstock User Flags by XUID. */
@Component({
  selector: 'woodstock-user-flags',
  templateUrl: './woodstock-user-flags.component.html',
  styleUrls: ['../user-flags.component.scss'],
})
export class WoodstockUserFlagsComponent extends UserFlagsBaseComponent<WoodstockUserFlags> {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(private readonly woodstockService: WoodstockService) {
    super();
  }

  /** Gets Woodstock user flags. */
  public getFlagsByXuid(xuid: BigNumber): Observable<WoodstockUserFlags> {
    return this.woodstockService.getFlagsByXuid(xuid);
  }

  /** Sets the newly selected Woodstock flags. */
  public putFlagsByXuid(
    xuid: BigNumber,
    newFlags: WoodstockUserFlags,
  ): Observable<WoodstockUserFlags> {
    return this.woodstockService.putFlagsByXuid(xuid, newFlags);
  }
}
