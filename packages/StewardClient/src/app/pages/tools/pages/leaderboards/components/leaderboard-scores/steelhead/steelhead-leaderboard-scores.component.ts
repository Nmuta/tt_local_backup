import { Component, Input, Output, EventEmitter } from '@angular/core';
import { GameTitle } from '@models/enums';
import { LeaderboardMetadataAndQuery, LeaderboardScore } from '@models/leaderboards';
import { SteelheadLeaderboardScoresFileService } from '@services/api-v2/steelhead/leaderboard-scores-file/steelhead-leaderboard-scores-file.service';
import { SteelheadLeaderboardsService } from '@services/api-v2/steelhead/leaderboards/steelhead-leaderboards.service';
import { LeaderboardScoresContract } from '../leaderboard-scores.component';

/**
 *  Displays leaderboard scores for Steelhead.
 */
@Component({
  selector: 'steelhead-leaderboard-scores',
  templateUrl: './steelhead-leaderboard-scores.component.html',
})
export class SteelheadLeaderboardScoresComponent {
  /** Leaderboard metadata and query. */
  @Input() leaderboard: LeaderboardMetadataAndQuery;
  /** Selected leaderboard score. */
  @Input() externalSelectedScore: LeaderboardScore;
  /** Output scores for deletion. */
  @Output() scoresDeleted = new EventEmitter<LeaderboardScore[]>();

  public gameTitle = GameTitle.FM8;

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
      scoreboardTypeId,
      scoreTypeId,
      trackId,
      pivotId,
      pegasusEnvironment,
    ) =>
      this.leaderboardScoresFileService.generateLeaderboardScoresFile$(
        scoreboardTypeId,
        scoreTypeId,
        trackId,
        pivotId,
        pegasusEnvironment,
      ),

    retrieveLeaderboardScoresFile$: (
      scoreboardTypeId,
      scoreTypeId,
      trackId,
      pivotId,
      pegasusEnvironment,
    ) =>
      this.leaderboardScoresFileService.retrieveLeaderboardScoresFile$(
        scoreboardTypeId,
        scoreTypeId,
        trackId,
        pivotId,
        pegasusEnvironment,
      ),

    getLeaderboardScoresFileMetadata$: (
      scoreboardTypeId,
      scoreTypeId,
      trackId,
      pivotId,
      pegasusEnvironment,
    ) =>
      this.leaderboardScoresFileService.getLeaderboardScoresFileMetadata$(
        scoreboardTypeId,
        scoreTypeId,
        trackId,
        pivotId,
        pegasusEnvironment,
      ),
  };

  constructor(
    public readonly leaderboardService: SteelheadLeaderboardsService,
    public readonly leaderboardScoresFileService: SteelheadLeaderboardScoresFileService,
  ) {}
}
