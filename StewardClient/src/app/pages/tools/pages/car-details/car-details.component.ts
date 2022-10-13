import { Component } from '@angular/core';
import { GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';

/** Displays the car details tool. */
@Component({
  templateUrl: './car-details.component.html',
  styleUrls: ['./car-details.component.scss'],
})
export class CarDetailsComponent {
  public navbarRouterLinks = [
    {
      name: GameTitleAbbreviation.FH5,
      codename: GameTitleCodeName.FH5,
      route: ['.', GameTitleCodeName.FH5.toLowerCase()],
    },
  ];
}
