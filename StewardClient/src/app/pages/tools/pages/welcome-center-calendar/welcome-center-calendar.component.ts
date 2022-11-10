import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';

/** Displays information about Welcome Center on a calendar. */
@Component({
  templateUrl: './welcome-center-calendar.component.html',
  styleUrls: ['./welcome-center-calendar.component.scss'],
})
export class WelcomeCenterCalendarComponent {
  public steelheadRouterLink = ['.', 'steelhead'];
  public gameTitleCodeName = GameTitleCodeName;
}
