import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { LeaderboardMetadataAndQuery, LeaderboardScore } from '@models/leaderboards';
import { SteelheadLeaderboardsService } from '@services/api-v2/steelhead/leaderboards/steelhead-leaderboards.service';
import { LeaderboardStatsContract } from '../leaderboard-stats.component';

/**
 *  Displays statistical analysis of leaderboard scores.
 */
@Component({
  selector: 'steelhead-leaderboard-stats',
  templateUrl: './steelhead-leaderboard-stats.component.html',
})
export class SteelheadLeaderboardStatsComponent {
  /** Leaderboard metadata and query. */
  @Input() leaderboard: LeaderboardMetadataAndQuery;
  /** Scores that have been deleted, to be removed from statistical display. */
  @Input() scoresDeleted: LeaderboardScore[];
  /** Output score selection for other tools to utilize. */
  @Output() selectedScore = new EventEmitter<LeaderboardScore>();

  public readonly gameTitle = GameTitle.FM8;

  public serviceContract: LeaderboardStatsContract = {
    talentUserGroupId: 23, //This is currently pointing at Studio user group Live Ops Devs. We will need to replace this with actual prod usergroup once we have a prod LSP
    getLeaderboardScores$: (
      scoreboardTypeId,
      scoreTypeId,
      trackId,
      pivotId,
      deviceTypes,
      startAt,
      maxResults,
      endpointKeyOverride,
    ) =>
      this.service.getLeaderboardScores$(
        scoreboardTypeId,
        scoreTypeId,
        trackId,
        pivotId,
        deviceTypes,
        startAt,
        maxResults,
        endpointKeyOverride,
      ),
    getLeaderboardTalentIdentities$: () => this.service.getLeaderboardTalentIdentities$(),
  };

  constructor(public readonly service: SteelheadLeaderboardsService) {}
}
