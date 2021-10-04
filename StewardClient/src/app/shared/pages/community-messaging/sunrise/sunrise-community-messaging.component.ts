import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { CommunityMessageResult } from '@models/community-message';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SunriseService } from '@services/sunrise';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';
import { CommunityMessagingBaseComponent } from '../base/community-messaging.base.component';
import { GameTitleCodeName } from '@models/enums';

/**
 *  Sunrise community messaging component.
 */
@Component({
  templateUrl: './sunrise-community-messaging.component.html',
  styleUrls: ['../base/community-messaging.base.component.scss'],
})
export class SunriseCommunityMessagingComponent extends CommunityMessagingBaseComponent {
  public gameTitle = GameTitleCodeName.FH4;

  constructor(private readonly sunriseService: SunriseService) {
    super();
  }

  /** Send community message to player(s).  */
  public submitCommunityMessage$(): Observable<CommunityMessageResult<BigNumber>[]> {
    return this.isUsingPlayerIdentities
      ? this.sunriseService.postSendCommunityMessageToXuids$(
          this.playerIdentities.map(identity => identity.xuid),
          this.newCommunityMessage,
        )
      : this.sunriseService
          .postSendCommunityMessageToLspGroup$(this.selectedLspGroup.id, this.newCommunityMessage)
          .pipe(switchMap(data => of([data])));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identities: AugmentedCompositeIdentity[]): void {
    const newIdentities = identities.filter(i => i?.extra?.hasSunrise).map(i => i.sunrise);
    this.playerIdentities = newIdentities;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasSunrise) {
      return `Player does not have a Sunrise account at the selected endpoint. Player will be ignored.`;
    }

    return null;
  }
}
