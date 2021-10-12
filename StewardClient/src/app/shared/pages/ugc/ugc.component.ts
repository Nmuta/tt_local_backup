import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { GameTitleCodeName } from '@models/enums';

/** Navbar component to display user generated content component. */
@Component({
  templateUrl: './ugc.component.html',
  styleUrls: ['./ugc.component.scss'],
})
export class UGCComponent implements OnInit {
  public navbarRouterLinks = [
    {
      name: GameTitleCodeName.FH5,
      route: ['.', GameTitleCodeName.FH5.toLowerCase()],
    },
    {
      name: GameTitleCodeName.FH4,
      route: ['.', GameTitleCodeName.FH4.toLowerCase()],
    },
  ];

  /** Lifecycle hook. */
  public ngOnInit(): void {
    // TODO: Make these into permanent routes after respective titles are fully integrated.
    if (!environment.production) {
      this.navbarRouterLinks.unshift({
        name: GameTitleCodeName.FM8,
        route: ['.', GameTitleCodeName.FM8.toLowerCase()],
      });
    }
  }
}
