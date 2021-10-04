import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { CommunityMessageResult } from '@models/community-message';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { WoodstockService } from '@services/woodstock';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';
import { CommunityMessagingBaseComponent } from '../base/community-messaging.base.component';
import { GameTitleCodeName } from '@models/enums';

/**
 *  Woodstock community messaging component.
 */
@Component({
  templateUrl: './woodstock-community-messaging.component.html',
  styleUrls: ['../base/community-messaging.base.component.scss'],
})
export class WoodstockCommunityMessagingComponent extends CommunityMessagingBaseComponent {
  public gameTitle = GameTitleCodeName.FH5;

  constructor(private readonly woodstockService: WoodstockService) {
    super();
  }

  /** Send community message to player(s).  */
  public submitCommunityMessage$(): Observable<CommunityMessageResult<BigNumber>[]> {
    return this.isUsingPlayerIdentities
      ? this.woodstockService.postSendCommunityMessageToXuids$(
          this.playerIdentities.map(identity => identity.xuid),
          this.newCommunityMessage,
        )
      : this.woodstockService
          .postSendCommunityMessageToLspGroup$(this.selectedLspGroup.id, this.newCommunityMessage)
          .pipe(switchMap(data => of([data])));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identities: AugmentedCompositeIdentity[]): void {
    const newIdentities = identities.filter(i => i?.extra?.hasWoodstock).map(i => i.woodstock);
    this.playerIdentities = newIdentities;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasWoodstock) {
      return `Player does not have a Woodstock account at the selected endpoint. Player will be ignored.`;
    }

    return null;
  }
}
