import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';

/** Displays information about Showroom on a calendar. */
@Component({
  templateUrl: './showroom-calendar.component.html',
  styleUrls: ['./showroom-calendar.component.scss'],
})
export class ShowroomCalendarComponent {
  public steelheadRouterLink = ['.', 'steelhead'];
  public gameTitleCodeName = GameTitleCodeName;
}
