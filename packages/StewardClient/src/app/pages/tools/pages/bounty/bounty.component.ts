import { Component, OnInit } from '@angular/core';
import { getBountySearchRoute } from '@helpers/route-links';
import { GameTitle, GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';

/** Navbar component to display bounty component. */
@Component({
  templateUrl: './bounty.component.html',
  styleUrls: ['./bounty.component.scss'],
})
export class BountyComponent implements OnInit {
  public navbarRouterLinks = [];

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.navbarRouterLinks = [
      {
        name: GameTitleAbbreviation.FM8,
        codename: GameTitleCodeName.FM8,
        route: getBountySearchRoute(GameTitle.FM8),
      },
    ];
  }
}
