import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { LeaderboardMetadataAndQuery, LeaderboardScore } from '@models/leaderboards';
import { WoodstockLeaderboardTalentService } from '@services/api-v2/woodstock/leaderboard-talent/woodstock-leaderboard-talent.service';
import { LeaderboardStatsContract } from '../leaderboard-stats.component';
import { WoodstockLeaderboardService } from '@services/api-v2/woodstock/leaderboard/woodstock-leaderboard.service';

/**
 *  Woodstock leaderboard stats component.
 */
@Component({
  selector: 'woodstock-leaderboard-stats',
  templateUrl: './woodstock-leaderboard-stats.component.html',
})
export class WoodstockLeaderboardStatsComponent {
  /** Leaderboard metadata and query. */
  @Input() leaderboard: LeaderboardMetadataAndQuery;
  /** Leaderboard scores deleted. */
  @Input() scoresDeleted: LeaderboardScore[];
  /** Output when a leaderboard score is selected. */
  @Output() selectedScore = new EventEmitter<LeaderboardScore>();

  public readonly gameTitle = GameTitle.FH5;

  public serviceContract: LeaderboardStatsContract = {
    talentUserGroupId: 14,
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
      this.leaderboardService.getLeaderboardScores$(
        scoreboardTypeId,
        scoreTypeId,
        trackId,
        pivotId,
        deviceTypes,
        startAt,
        maxResults,
        endpointKeyOverride,
      ),
    getLeaderboardTalentIdentities$: () =>
      this.leaderboardTalentService.getRetailLeaderboardTalentIdentities$(),
  };

  constructor(
    public readonly leaderboardService: WoodstockLeaderboardService,
    public readonly leaderboardTalentService: WoodstockLeaderboardTalentService,
  ) {}
}
