import { Component, OnInit } from '@angular/core';
import { GameTitle, GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';

/** Navbar component to display bounty details component. */
@Component({
  templateUrl: './bounty-details.component.html',
  styleUrls: ['./bounty-details.component.scss'],
})
export class BountyDetailsComponent implements OnInit {
  public navbarRouterLinks = [];

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.navbarRouterLinks = [
      {
        name: GameTitleAbbreviation.FM8,
        codename: GameTitleCodeName.FM8,
        route: ['.', GameTitle.FM8],
      },
    ];
  }
}
