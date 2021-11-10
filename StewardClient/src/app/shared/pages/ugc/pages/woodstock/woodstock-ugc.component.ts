import { Component } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { UGCType } from '@models/ugc-filters';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { keys } from 'lodash';

/** Routed Component; Woodstock UGC Tool. */
@Component({
  templateUrl: './woodstock-ugc.component.html',
  styleUrls: ['./woodstock-ugc.component.scss'],
})
export class WoodstockUGCComponent {
  public identity: IdentityResultAlpha = null;
  public shareCode: string = null;
  public selectedPlayer: IdentityResultAlpha = null;
  public usingPlayerIdentities: boolean = true;

  public contentTypeOptions: UGCType[] = keys(UGCType).filter(
    x => x !== UGCType.Unknown,
  ) as UGCType[];
  public contentType = this.contentTypeOptions[0];

  /** Logic when player selection outputs identities. */
  public onPlayerIdentityChange(identity: AugmentedCompositeIdentity): void {
    this.identity = identity?.extra?.hasWoodstock ? identity.woodstock : null;
  }

  /** Selects a given player. */
  public selectPlayer(identity: IdentityResultAlpha): void {
    this.selectedPlayer = identity;
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayer = identity?.extra?.hasWoodstock ? identity.woodstock : null;
  }

  /** Logic when the share code input changes.  */
  public onShareCodeChange($event: string): void {
    this.shareCode = $event;
  }

  /** Logic when the mat tab selection changes. */
  public matTabSelectionChange(index: number): void {
    this.usingPlayerIdentities = index === 0;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasWoodstock) {
      return 'Player does not have a woodstock account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }
}
