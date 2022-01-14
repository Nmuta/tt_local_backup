import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import {
  LEADERBOARD_SCOREBOARD_TYPES,
  LEADERBOARD_SCORE_TYPES,
  LEADERBOARD_VIEWS,
} from './search-leaderboards.data';

/** Displays the search-leaderboards tool. */
@Component({
  selector: 'search-leaderboards',
  templateUrl: './search-leaderboards.component.html',
  styleUrls: ['./search-leaderboards.component.scss'],
})
export class SearchLeaderboardsComponent extends BaseComponent {
  public readonly scoreTypes: string[] = LEADERBOARD_SCORE_TYPES;
  public readonly scoreboardTypes: string[] = LEADERBOARD_SCOREBOARD_TYPES;
  public readonly views: string[] = LEADERBOARD_VIEWS;

  public formControls = {
    scoreType: new FormControl(this.scoreTypes[0], Validators.required),
    scoreboardType: new FormControl(this.scoreboardTypes[0], Validators.required),
    view: new FormControl(this.views[0], Validators.required),
    trackId: new FormControl('', Validators.required),
    pivotId: new FormControl('', Validators.required),
    xuid: new FormControl(''),
  };

  public formGroup = new FormGroup(this.formControls);
}
