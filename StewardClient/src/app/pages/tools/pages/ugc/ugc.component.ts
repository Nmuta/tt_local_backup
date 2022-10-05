import { Component, OnInit } from '@angular/core';
import { getUgcSearchRoute } from '@helpers/route-links';
import { GameTitle, GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';

/** Navbar component to display user generated content component. */
@Component({
  templateUrl: './ugc.component.html',
  styleUrls: ['./ugc.component.scss'],
})
export class UgcComponent implements OnInit {
  public navbarRouterLinks = [];

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.navbarRouterLinks = [
      {
        name: GameTitleAbbreviation.FM8,
        codename: GameTitleCodeName.FM8,
        route: getUgcSearchRoute(GameTitle.FM8),
      },
      {
        name: GameTitleAbbreviation.FH5,
        codename: GameTitleCodeName.FH5,
        route: getUgcSearchRoute(GameTitle.FH5),
      },
    ];
  }
}
