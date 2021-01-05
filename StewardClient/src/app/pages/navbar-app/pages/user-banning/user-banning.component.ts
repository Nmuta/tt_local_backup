import { Component, OnInit } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { createNavbarPath, NavbarTools } from '../../navbar-tool-list';

@Component({
  selector: 'app-user-banning',
  templateUrl: './user-banning.component.html',
  styleUrls: ['./user-banning.component.scss']
})
export class UserBanningComponent {
  public rootRouterLink = createNavbarPath(NavbarTools.UserBanningPage).routerLink;
  public navbarRouterLinks = [
    {
      name: GameTitleCodeName.Street,
      route: [...this.rootRouterLink, GameTitleCodeName.Street.toLowerCase()],
    },
    {
      name: GameTitleCodeName.FH4,
      route: [...this.rootRouterLink, GameTitleCodeName.FH4.toLowerCase()],
    },
    {
      name: GameTitleCodeName.FM7,
      route: [...this.rootRouterLink, GameTitleCodeName.FM7.toLowerCase()],
    },
    {
      name: GameTitleCodeName.FH3,
      route: [...this.rootRouterLink, GameTitleCodeName.FH3.toLowerCase()],
    },
  ];
}
