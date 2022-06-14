import { Component, OnInit } from '@angular/core';
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
        name: GameTitleAbbreviation.FH5,
        codename: GameTitleCodeName.FH5,
        route: ['.', GameTitle.FH5],
      },
    ];
  }
}
