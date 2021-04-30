import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { createNavbarPath, NavbarTools } from '@navbar-app/navbar-tool-list';
import { GamertagsBaseComponent } from '../gamertags.base.component';
import { SteelheadSharedConsoleUser } from '@models/steelhead';
import { SteelheadService } from '@services/steelhead';
import { Observable } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays related Steelhead accounts by XUID. */
@Component({
  selector: 'steelhead-gamertags',
  templateUrl: '../gamertags.component.html',
  styleUrls: ['../gamertags.component.scss'],
})
export class SteelheadGamertagsComponent extends GamertagsBaseComponent<
  SteelheadSharedConsoleUser
> {
  public gameTitle = GameTitleCodeName.FM8;
  public userDetailsRouterLink = [
    ...createNavbarPath(NavbarTools.UserDetailsPage).routerLink,
    'steelhead',
  ];

  constructor(private readonly steelheadService: SteelheadService) {
    super();
  }

  /** Gets the shared console gamertag list. */
  public getSharedConsoleUsersByXuid(xuid: BigNumber): Observable<SteelheadSharedConsoleUser[]> {
    return this.steelheadService.getSharedConsoleUsersByXuid(xuid);
  }
}