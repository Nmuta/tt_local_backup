import { Component } from '@angular/core';
import { GameTitleCodeName, GameTitleAbbreviation } from '@models/enums';

/** The user banning component. */
@Component({
  selector: 'app-user-banning',
  templateUrl: './user-banning.component.html',
  styleUrls: ['./user-banning.component.scss'],
})
export class UserBanningComponent {
  public navbarRouterLinks = [
    {
      name: GameTitleAbbreviation.FM8,
      codename: GameTitleCodeName.FM8,
      route: ['.', GameTitleCodeName.FM8.toLowerCase()],
    },
    {
      name: GameTitleAbbreviation.FH5,
      codename: GameTitleCodeName.FH5,
      route: ['.', GameTitleCodeName.FH5.toLowerCase()],
    },
    {
      name: GameTitleAbbreviation.FH4,
      codename: GameTitleCodeName.FH4,
      route: ['.', GameTitleCodeName.FH4.toLowerCase()],
    },
    {
      name: GameTitleAbbreviation.FM7,
      codename: GameTitleCodeName.FM7,
      route: ['.', GameTitleCodeName.FM7.toLowerCase()],
    },
  ];
}
