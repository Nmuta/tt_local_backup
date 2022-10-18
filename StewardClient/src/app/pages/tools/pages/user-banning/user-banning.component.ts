import { Component } from '@angular/core';
import { BaseNavbarComponent, NavbarLink } from '@components/base-component/base-navbar.component';
import { getUserBanningRoute } from '@helpers/route-links';
import { GameTitleCodeName, GameTitleAbbreviation, GameTitle } from '@models/enums';

/** The user banning component. */
@Component({
  selector: 'app-user-banning',
  templateUrl: './user-banning.component.html',
  styleUrls: ['./user-banning.component.scss'],
})
export class UserBanningComponent extends BaseNavbarComponent {
  public navbarRouterLinks: NavbarLink[] = [
    {
      name: GameTitleAbbreviation.FM8,
      codename: GameTitleCodeName.FM8,
      route: getUserBanningRoute(GameTitle.FM8),
    },
    {
      name: GameTitleAbbreviation.FH5,
      codename: GameTitleCodeName.FH5,
      route: getUserBanningRoute(GameTitle.FH5),
    },
    {
      name: GameTitleAbbreviation.FH4,
      codename: GameTitleCodeName.FH4,
      route: getUserBanningRoute(GameTitle.FH4),
    },
    {
      name: GameTitleAbbreviation.FM7,
      codename: GameTitleCodeName.FM7,
      route: getUserBanningRoute(GameTitle.FM7),
    },
  ];
}
