import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GameTitle } from '@models/enums';
import { LeaderboardMetadataAndQuery, LeaderboardScore } from '@models/leaderboards';
import { WoodstockLeaderboardTalentService } from '@services/api-v2/woodstock/leaderboard-talent/woodstock-leaderboard-talent.service';
import { WoodstockService } from '@services/woodstock';
import { LeaderboardStatsContract } from '../leaderboard-stats.component';

/**
 *  Woodstock leaderboard stats component.
 */
@Component({
  selector: 'woodstock-leaderboard-stats',
  templateUrl: './woodstock-leaderboard-stats.component.html',
})
export class WoodstockLeaderboardStatsComponent {
  /** REVIEW-COMMENT: Leaderboard metadata and query. */
  @Input() leaderboard: LeaderboardMetadataAndQuery;
  /** REVIEW-COMMENT: Leaderboard scores deleted. */
  @Input() scoresDeleted: LeaderboardScore[];
  /** REVIEW-COMMENT: Output when a leaderboard score is selected. */
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
    getLeaderboardTalentIdentities$: () =>
      this.leaderboardTalentService.getRetailLeaderboardTalentIdentities$(),
  };

  constructor(
    public readonly service: WoodstockService,
    public readonly leaderboardTalentService: WoodstockLeaderboardTalentService,
  ) {}
}
