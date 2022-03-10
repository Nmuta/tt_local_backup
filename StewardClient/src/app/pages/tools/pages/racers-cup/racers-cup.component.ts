import { Component } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';

/** Displays information about Racer's Cup. */
@Component({
  templateUrl: './racers-cup.component.html',
  styleUrls: ['./racers-cup.component.scss'],
})
export class RacersCupComponent {
  public steelheadRouterLink = ['.', 'steelhead'];
  public gameTitleCodeName = GameTitleCodeName;
}
