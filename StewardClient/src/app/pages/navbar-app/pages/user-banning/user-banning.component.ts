import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { GameTitleCodeName } from '@models/enums';
import { createNavbarPath, NavbarTools } from '@navbar-app/navbar-tool-list';

/** The user banning component. */
@Component({
  selector: 'app-user-banning',
  templateUrl: './user-banning.component.html',
  styleUrls: ['./user-banning.component.scss'],
})
export class UserBanningComponent implements OnInit {
  public rootRouterLink = createNavbarPath(NavbarTools.UserBanningPage).routerLink;
  public navbarRouterLinks = [
    {
      name: GameTitleCodeName.FH4,
      route: [...this.rootRouterLink, GameTitleCodeName.FH4.toLowerCase()],
    },
    {
      name: GameTitleCodeName.FM7,
      route: [...this.rootRouterLink, GameTitleCodeName.FM7.toLowerCase()],
    },
  ];

  /** Lifecycle hook. */
  public ngOnInit(): void {
    // TODO: Make this a permanent route after Steelhead is fully integrated.
    if (!environment.production) {
      this.navbarRouterLinks.unshift({
        name: GameTitleCodeName.FM8,
        route: [...this.rootRouterLink, GameTitleCodeName.FM8.toLowerCase()],
      });
    }
  }
}
