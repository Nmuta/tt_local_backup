import { Component, EventEmitter, Output } from '@angular/core';
import { WoodstockLeaderboardsService } from '@services/api-v2/woodstock/leaderboards/woodstock-leaderboards.service';
import { SearchLeaderboardsContract } from '../search-leaderboards.component';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { GameTitle } from '@models/enums';

/**
 *  Woodstock search leaderboards component.
 */
@Component({
  selector: 'woodstock-search-leaderboards',
  templateUrl: './woodstock-search-leaderboards.component.html',
})
export class WoodstockSearchLeaderboardsComponent {
  /** Output when an identity is selected. */
  @Output() selectedIdentity = new EventEmitter<AugmentedCompositeIdentity>();

  public service: SearchLeaderboardsContract;

  constructor(public readonly leaderboardsService: WoodstockLeaderboardsService) {
    this.service = {
      gameTitle: GameTitle.FH5,
      getLeaderboards$: (pegasusEnvironment: string) => {
        return leaderboardsService.getLeaderboards$(pegasusEnvironment);
      },
      foundFn: this.foundFn,
      rejectionFn: this.rejectionFn,
    };
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public rejectionFn(identity: AugmentedCompositeIdentity): string | null {
    if (!identity?.extra?.hasWoodstock) {
      return 'Player does not have a woodstock account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }

  /** Produces title specific identity, if it exists. */
  public foundFn(newIdentity: AugmentedCompositeIdentity): IdentityResultAlpha | null {
    if (newIdentity?.woodstock?.error) {
      return null;
    }

    return newIdentity?.woodstock;
  }
}
