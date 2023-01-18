import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';

/** Displays information about Builder's Cup on a calendar. */
@Component({
  templateUrl: './builders-cup-calendar.component.html',
  styleUrls: ['./builders-cup-calendar.component.scss'],
})
export class BuildersCupCalendarComponent {
  public steelheadRouterLink = ['.', 'steelhead'];
  public gameTitleCodeName = GameTitleCodeName;
}
