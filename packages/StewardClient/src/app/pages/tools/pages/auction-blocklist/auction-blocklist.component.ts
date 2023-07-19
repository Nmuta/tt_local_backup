import { Component, OnInit } from '@angular/core';
import { getAuctionBlocklistRoute } from '@helpers/route-links';
import { GameTitle, GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';

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
        name: GameTitleAbbreviation.FH5,
        codename: GameTitleCodeName.FH5,
        route: getAuctionBlocklistRoute(GameTitle.FH5),
      },
      {
        name: GameTitleAbbreviation.FH4,
        codename: GameTitleCodeName.FH4,
        route: getAuctionBlocklistRoute(GameTitle.FH4),
      },
    ];
  }
}
