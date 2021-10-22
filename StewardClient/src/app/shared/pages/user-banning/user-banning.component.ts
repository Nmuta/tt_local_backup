import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { GameTitleCodeName, GameTitleAbbreviation } from '@models/enums';

/** The user banning component. */
@Component({
  selector: 'app-user-banning',
  templateUrl: './user-banning.component.html',
  styleUrls: ['./user-banning.component.scss'],
})
export class UserBanningComponent implements OnInit {
  public navbarRouterLinks = [
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

  /** Lifecycle hook. */
  public ngOnInit(): void {
    // TODO: Make these into permanent routes after respective titles are fully integrated.
    if (!environment.production) {
      this.navbarRouterLinks.unshift({
        name: GameTitleAbbreviation.FM8,
        codename: GameTitleCodeName.FM8,
        route: ['.', GameTitleCodeName.FM8.toLowerCase()],
      });
    }
  }
}
