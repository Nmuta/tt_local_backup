import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { getUserGroupManagementRoute } from '@helpers/route-links';
import { GameTitleCodeName, GameTitleAbbreviation, GameTitle } from '@models/enums';

/** The user group management page for the Navbar app. */
@Component({
  templateUrl: './user-group-management.component.html',
  styleUrls: ['./user-group-management.component.scss'],
})
export class UserGroupManagementComponent implements OnInit {
  public navbarRouterLinks = [
    {
      name: GameTitleAbbreviation.FH5,
      codename: GameTitleCodeName.FH5,
      route: getUserGroupManagementRoute(GameTitle.FH5),
    },
  ];

  /** Lifecycle hook. */
  public ngOnInit(): void {
    // TODO: Make these permanent routes after respective titles are fully integrated.
    if (!environment.production) {
      this.navbarRouterLinks.unshift({
        name: GameTitleAbbreviation.FM8,
        codename: GameTitleCodeName.FM8,
        route: getUserGroupManagementRoute(GameTitle.FM8),
      });
      this.navbarRouterLinks.push({
        name: GameTitleAbbreviation.FH4,
        codename: GameTitleCodeName.FH4,
        route: getUserGroupManagementRoute(GameTitle.FH4),
      });
      this.navbarRouterLinks.push({
        name: GameTitleAbbreviation.FM7,
        codename: GameTitleCodeName.FM7,
        route: getUserGroupManagementRoute(GameTitle.FM7),
      });
    }
  }
}
