import { Component } from '@angular/core';
import { getUserGroupManagementRoute } from '@helpers/route-links';
import { GameTitleCodeName, GameTitleAbbreviation, GameTitle } from '@models/enums';

/** The user group management page for the Navbar app. */
@Component({
  templateUrl: './user-group-management.component.html',
  styleUrls: ['./user-group-management.component.scss'],
})
export class UserGroupManagementComponent {
  public navbarRouterLinks = [
    {
      name: GameTitleAbbreviation.FM8,
      codename: GameTitleCodeName.FM8,
      route: getUserGroupManagementRoute(GameTitle.FM8),
    },
    {
      name: GameTitleAbbreviation.FH5,
      codename: GameTitleCodeName.FH5,
      route: getUserGroupManagementRoute(GameTitle.FH5),
    },
    {
      name: GameTitleAbbreviation.FH4,
      codename: GameTitleCodeName.FH4,
      route: getUserGroupManagementRoute(GameTitle.FH4),
    },
    {
      name: GameTitleAbbreviation.FM7,
      codename: GameTitleCodeName.FM7,
      route: getUserGroupManagementRoute(GameTitle.FM7),
    },
  ];
}
