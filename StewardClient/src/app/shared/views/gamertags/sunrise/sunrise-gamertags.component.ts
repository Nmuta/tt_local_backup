import { Component } from '@angular/core';
import { SunriseSharedConsoleUser } from '@models/sunrise';
import { SunriseService } from '@services/sunrise/sunrise.service';
import { createNavbarPath, NavbarTools } from '@navbar-app/navbar-tool-list';
import { GamertagsBaseComponent } from '../gamertags.base.component';
import { Observable } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays related Sunrise accounts by XUID. */
@Component({
  selector: 'sunrise-gamertags',
  templateUrl: '../gamertags.component.html',
  styleUrls: ['../gamertags.component.scss'],
})
export class SunriseGamertagsComponent extends GamertagsBaseComponent<SunriseSharedConsoleUser> {
  public gameTitle = GameTitleCodeName.FH4;
  public userDetailsRouterLink = [
    ...createNavbarPath(NavbarTools.UserDetailsPage).routerLink,
    'sunrise',
  ];

  constructor(private readonly sunriseService: SunriseService) {
    super();
  }

  /** Gets the shared console gamertag list. */
  public getSharedConsoleUsersByXuid(xuid: bigint): Observable<SunriseSharedConsoleUser[]> {
    return this.sunriseService.getSharedConsoleUsersByXuid(xuid);
  }
}
