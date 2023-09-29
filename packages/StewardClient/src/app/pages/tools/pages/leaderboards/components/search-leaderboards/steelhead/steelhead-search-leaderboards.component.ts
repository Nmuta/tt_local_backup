import { Component, EventEmitter, Output } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SteelheadLeaderboardsService } from '@services/api-v2/steelhead/leaderboards/steelhead-leaderboards.service';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { SearchLeaderboardsContract } from '../search-leaderboards.component';
import { GameTitle } from '@models/enums';

/**
 *  Searches Steelhead leaderboards.
 */
@Component({
  selector: 'steelhead-search-leaderboards',
  templateUrl: './steelhead-search-leaderboards.component.html',
})
export class SteelheadSearchLeaderboardsComponent {
  /** Output when an identity is selected. */
  @Output() selectedIdentityChange = new EventEmitter<AugmentedCompositeIdentity>();

  public service: SearchLeaderboardsContract;

  constructor(public readonly leaderboardsService: SteelheadLeaderboardsService) {
    this.service = {
      gameTitle: GameTitle.FM8,
      getLeaderboards$: (pegasusEnvironment: string) => {
        return leaderboardsService.getLeaderboards$(pegasusEnvironment);
      },
      foundFn: this.foundFn,
      rejectionFn: this.rejectionFn,
    };
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public rejectionFn(identity: AugmentedCompositeIdentity): string | null {
    if (!identity?.extra?.hasSteelhead) {
      return 'Player does not have a steelhead account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }

  /** Produces title specific identity, if it exists. */
  public foundFn(newIdentity: AugmentedCompositeIdentity): IdentityResultAlpha | null {
    if (newIdentity?.steelhead?.error) {
      return null;
    }

    return newIdentity?.steelhead;
  }
}
