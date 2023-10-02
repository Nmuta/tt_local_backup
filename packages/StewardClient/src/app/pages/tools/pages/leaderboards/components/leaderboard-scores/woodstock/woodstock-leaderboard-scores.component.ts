import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GameTitle } from '@models/enums';
import { LeaderboardMetadataAndQuery, LeaderboardScore } from '@models/leaderboards';
import { WoodstockLeaderboardService } from '@services/api-v2/woodstock/leaderboard/woodstock-leaderboard.service';
import { LeaderboardScoresContract } from '../leaderboard-scores.component';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';

/**
 *  Woodstock leaderboard scores component.
 */
@Component({
  selector: 'woodstock-leaderboard-scores',
  templateUrl: './woodstock-leaderboard-scores.component.html',
})
export class WoodstockLeaderboardScoresComponent {
  /** Leaderboard metadata and query. */
  @Input() leaderboard: LeaderboardMetadataAndQuery;
  /** Selected score. */
  @Input() externalSelectedScore: LeaderboardScore;
  /** Selected identity. */
  @Input() externalSelectedIdentity: AugmentedCompositeIdentity;
  /** Output when leaderboard scores are deleted. */
  @Output() scoresDeleted = new EventEmitter<LeaderboardScore[]>();

  public gameTitle = GameTitle.FH5;

  public serviceContract: LeaderboardScoresContract = {
    getLeaderboardMetadata$: (
      scoreboardTypeId,
      scoreTypeId,
      trackId,
      pivotId,
      pegasusEnvironment,
    ) =>
      this.leaderboardService.getLeaderboardMetadata$(
        scoreboardTypeId,
        scoreTypeId,
        trackId,
        pivotId,
        pegasusEnvironment,
      ),

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

    getLeaderboardScoresNearPlayer$: (
      xuid,
      scoreboardTypeId,
      scoreTypeIdr,
      trackId,
      pivotId,
      deviceTypes,
      maxResults,
      endpointKeyOverride,
    ) =>
      this.leaderboardService.getLeaderboardScoresNearPlayer$(
        xuid,
        scoreboardTypeId,
        scoreTypeIdr,
        trackId,
        pivotId,
        deviceTypes,
        maxResults,
        endpointKeyOverride,
      ),

    deleteLeaderboardScores$: (scoreIds, endpointKeyOverride) =>
      this.leaderboardService.deleteLeaderboardScores$(scoreIds, endpointKeyOverride),

    generateLeaderboardScoresFile$: (
      _scoreboardTypeId,
      _scoreTypeId,
      _trackId,
      _pivotId,
      _pegasusEnvironment,
    ) => undefined,

    retrieveLeaderboardScoresFile$: (
      _scoreboardTypeId,
      _scoreTypeId,
      _trackId,
      _pivotId,
      _pegasusEnvironment,
    ) => undefined,

    getLeaderboardScoresFileMetadata$: (
      _scoreboardTypeId,
      _scoreTypeId,
      _trackId,
      _pivotId,
      _pegasusEnvironment,
    ) => undefined,
  };

  constructor(public leaderboardService: WoodstockLeaderboardService) {}
}
