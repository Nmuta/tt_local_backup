import { Component, OnInit } from '@angular/core';
import { GameTitle } from '@models/enums';

/**
 *  Auction blocklist page component.
 */
@Component({
  templateUrl: './auction-blocklist.component.html',
  styleUrls: ['./auction-blocklist.component.scss'],
})
export class AuctionBlocklistComponent implements OnInit {
  public navbarRouterLinks = [];

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.navbarRouterLinks = [
      {
        name: GameTitle.FH5,
        route: ['.', GameTitle.FH5],
      },
      {
        name: GameTitle.FH4,
        route: ['.', GameTitle.FH4],
      },
    ];
  }
}
