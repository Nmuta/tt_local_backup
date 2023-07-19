import { Component } from '@angular/core';
import { getUnifiedCalendarRoute } from '@helpers/route-links';
import { GameTitle, GameTitleAbbreviation, GameTitleCodeName } from '@models/enums';

/** Displays the Steward Unified Calendar tool. */
@Component({
  templateUrl: './unified-calendar.component.html',
  styleUrls: ['./unified-calendar.component.scss'],
})
export class UnifiedCalendarComponent {
  public navbarRouterLinks = [
    {
      name: GameTitleAbbreviation.FM8,
      codename: GameTitleCodeName.FM8,
      route: getUnifiedCalendarRoute(GameTitle.FM8),
    },
  ];
}
