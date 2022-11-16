import { Component } from '@angular/core';
import { getMessageOfTheDayRoute } from '@helpers/route-links';
import { GameTitle, GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';

/** Displays the message of the day tool. */
@Component({
  templateUrl: './message-of-the-day.component.html',
  styleUrls: ['./message-of-the-day.component.scss'],
})
export class MessageOfTheDayComponent {
  public navbarRouterLinks = [
    {
      name: GameTitleAbbreviation.FM8,
      codename: GameTitleCodeName.FM8,
      route: getMessageOfTheDayRoute(GameTitle.FM8),
    },
  ];
}
