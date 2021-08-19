import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { GameTitleCodeName } from '@models/enums';

/** The gift history page for the Navbar app. */
@Component({
  templateUrl: './gift-history.component.html',
  styleUrls: ['./gift-history.component.scss'],
})
export class GiftHistoryComponent implements OnInit {
  public navbarRouterLinks = [
    {
      name: GameTitleCodeName.Street,
      route: ['.', GameTitleCodeName.Street.toLowerCase()],
    },
    {
      name: GameTitleCodeName.FH4,
      route: ['.', GameTitleCodeName.FH4.toLowerCase()],
    },
    {
      name: GameTitleCodeName.FM7,
      route: ['.', GameTitleCodeName.FM7.toLowerCase()],
    },
  ];

  /** Lifecycle hook. */
  public ngOnInit(): void {
    // TODO: Make these permanent routes after respective titles are fully integrated.
    if (!environment.production) {
      this.navbarRouterLinks.unshift({
        name: GameTitleCodeName.FM8,
        route: ['.', GameTitleCodeName.FM8.toLowerCase()],
      });
      this.navbarRouterLinks.unshift({
        name: GameTitleCodeName.FH5,
        route: ['.', GameTitleCodeName.FH5.toLowerCase()],
      });
    }
  }
}
