import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { GameTitleCodeName } from '@models/enums';

/** The gifting page for the Navbar app. */
@Component({
  templateUrl: './gifting.component.html',
  styleUrls: ['./gifting.component.scss'],
})
export class GiftingComponent implements OnInit {
  public navbarRouterLinks = [];

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.navbarRouterLinks = [
      {
        name: GameTitleCodeName.FH5,
        route: ['.', GameTitleCodeName.FH5.toLowerCase()],
      },
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

    // TODO: Make this a permanent route after Steelhead is fully integrated.
    if (!environment.production) {
      this.navbarRouterLinks.unshift({
        name: GameTitleCodeName.FM8,
        route: ['.', GameTitleCodeName.FM8.toLowerCase()],
      });
    }
  }
}
