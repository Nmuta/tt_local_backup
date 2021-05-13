import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { Observable } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';
import { SunriseProfileRollback } from '@models/sunrise';
import { ProfileRollbacksBaseComponent } from '../profile-rollbacks.base.component';

/** Retreives and displays Sunrise user profile rollbacks by XUID. */
@Component({
  selector: 'sunrise-profile-rollbacks',
  templateUrl: '../profile-rollbacks.component.html',
  styleUrls: ['../profile-rollbacks.component.scss'],
})
export class SunriseProfileRollbacksComponent extends ProfileRollbacksBaseComponent<
  SunriseProfileRollback
> {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunriseService: SunriseService) {
    super();
  }

  /** Gets Sunrise user flags. */
  public getProfileRollbacksXuid$(xuid: BigNumber): Observable<SunriseProfileRollback[]> {
    return this.sunriseService.getProfileRollbacksXuid$(xuid);
  }
}
