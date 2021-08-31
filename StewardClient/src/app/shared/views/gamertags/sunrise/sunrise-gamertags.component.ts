import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { SunriseSharedConsoleUser } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { GamertagsBaseComponent } from '../gamertags.base.component';
import { Observable } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';
import { ActivatedRoute } from '@angular/router';

/** Retreives and displays related Sunrise accounts by XUID. */
@Component({
  selector: 'sunrise-gamertags',
  templateUrl: '../gamertags.component.html',
  styleUrls: ['../gamertags.component.scss'],
})
export class SunriseGamertagsComponent extends GamertagsBaseComponent<SunriseSharedConsoleUser> {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunriseService: SunriseService, route: ActivatedRoute) {
    super(route);
  }

  /** Gets the shared console gamertag list. */
  public getSharedConsoleUsersByXuid$(xuid: BigNumber): Observable<SunriseSharedConsoleUser[]> {
    return this.sunriseService.getSharedConsoleUsersByXuid$(xuid);
  }
}
