import { Component } from '@angular/core';
import { getCreateAuctionRoute } from '@helpers/route-links';
import { GameTitle, GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';

/** Displays the create auction tool. */
@Component({
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.scss'],
})
export class CreateAuctionComponent {
  public navbarRouterLinks = [
    {
      name: GameTitleAbbreviation.FH5,
      codename: GameTitleCodeName.FH5,
      route: getCreateAuctionRoute(GameTitle.FH5),
    },
  ];
}
