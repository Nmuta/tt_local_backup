import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { WoodstockSharedConsoleUser } from '@models/woodstock';
import { WoodstockService } from '@services/woodstock/woodstock.service';
import { createNavbarPath, NavbarTools } from '@navbar-app/navbar-tool-list';
import { GamertagsBaseComponent } from '../gamertags.base.component';
import { Observable } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays related Woodstock accounts by XUID. */
@Component({
  selector: 'woodstock-gamertags',
  templateUrl: '../gamertags.component.html',
  styleUrls: ['../gamertags.component.scss'],
})
export class WoodstockGamertagsComponent extends GamertagsBaseComponent<
  WoodstockSharedConsoleUser
> {
  public gameTitle = GameTitleCodeName.FH5;
  public userDetailsRouterLink = [
    ...createNavbarPath(NavbarTools.UserDetailsPage).routerLink,
    'woodstock',
  ];

  constructor(private readonly woodstockService: WoodstockService) {
    super();
  }

  /** Gets the shared console gamertag list. */
  public getSharedConsoleUsersByXuid$(xuid: BigNumber): Observable<WoodstockSharedConsoleUser[]> {
    return this.woodstockService.getSharedConsoleUsersByXuid$(xuid);
  }
}
