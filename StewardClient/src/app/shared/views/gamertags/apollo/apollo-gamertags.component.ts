import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { createNavbarPath, NavbarTools } from '@navbar-app/navbar-tool-list';
import { GamertagsBaseComponent } from '../gamertags.base.component';
import { ApolloSharedConsoleUser } from '@models/apollo';
import { ApolloService } from '@services/apollo';
import { Observable } from 'rxjs';
import { GameTitleCodeName } from '@models/enums';

/** Retreives and displays related Apollo accounts by XUID. */
@Component({
  selector: 'apollo-gamertags',
  templateUrl: '../gamertags.component.html',
  styleUrls: ['../gamertags.component.scss'],
})
export class ApolloGamertagsComponent extends GamertagsBaseComponent<ApolloSharedConsoleUser> {
  public gameTitle = GameTitleCodeName.FM7;
  public userDetailsRouterLink = [
    ...createNavbarPath(NavbarTools.UserDetailsPage).routerLink,
    'apollo',
  ];

  constructor(private readonly apolloService: ApolloService) {
    super();
  }

  /** Gets the shared console gamertag list. */
  public getSharedConsoleUsersByXuid$(xuid: BigNumber): Observable<ApolloSharedConsoleUser[]> {
    return this.apolloService.getSharedConsoleUsersByXuid$(xuid);
  }
}
