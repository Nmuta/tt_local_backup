import { Component, OnInit } from '@angular/core';
import { GameTitle } from '@models/enums';
import { IdentityResultAlphaBatch, IdentityResultAlpha } from '@models/identity-query.model';
import { LspGroup } from '@models/lsp-group';
import { SunriseMasterInventory } from '@models/sunrise';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { Select, Store } from '@ngxs/store';
import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { SunriseGiftingState } from './state/sunrise-gifting.state';
import {
  SetSunriseGiftingMatTabIndex,
  SetSunriseGiftingSelectedPlayerIdentities,
} from './state/sunrise-gifting.state.actions';
import { GiftingBaseComponent } from '../base/gifting.base.component';
import { ActivatedRoute } from '@angular/router';
import { ParsePathParamFunctions, PathParams } from '@models/path-params';
import { ExtendedPlayerInventoryProfile } from '@models/player-inventory-profile';

/** The sunrise gifting page. */
@Component({
  templateUrl: './sunrise-gifting.component.html',
  styleUrls: ['./sunrise-gifting.component.scss'],
})
export class SunriseGiftingComponent extends GiftingBaseComponent<BigNumber> implements OnInit {
  @Select(SunriseGiftingState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultAlphaBatch>;

  public gameTitle = GameTitle.FH4;
  /** All selected player identities from player selection tool. */
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  /** Selected LSP group. */
  public selectedLspGroup: LspGroup;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultAlpha;
  public selectedPlayerInventoryProfile: ExtendedPlayerInventoryProfile;
  public selectedPlayerInventory: SunriseMasterInventory;

  public giftingTypeMatTabSelectedIndex: number = 0;

  constructor(protected readonly store: Store, private readonly route: ActivatedRoute) {
    super(store);
  }

  /** Initialization hook */
  public ngOnInit(): void {
    super.ngOnInit();

    this.route.queryParams
      .pipe(
        map(() => ParsePathParamFunctions[PathParams.LiveryId](this.route)),
        filter(liveryId => !!liveryId),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.giftingTypeMatTabSelectedIndex = 1;
      });

    this.matTabSelectedIndex = this.store.selectSnapshot<number>(
      SunriseGiftingState.selectedMatTabIndex,
    );

    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
      });
  }

  /** Tracks when the mat tab is changed  */
  public matTabSelectionChange(index: number): void {
    this.store.dispatch(new SetSunriseGiftingMatTabIndex(index));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identity: AugmentedCompositeIdentity[]): void {
    const newIdentities = identity.filter(i => i?.extra?.hasSunrise).map(i => i.sunrise);
    this.store.dispatch(new SetSunriseGiftingSelectedPlayerIdentities(newIdentities));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity?.extra?.hasSunrise ? identity.sunrise : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: SunriseMasterInventory): void {
    this.selectedPlayerInventory = inventory;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasSunrise) {
      return 'Player does not have a sunrise account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }

  /** Called when a new profile is picked. */
  public onProfileChange(newProfile: ExtendedPlayerInventoryProfile): void {
    this.selectedPlayerInventoryProfileId = newProfile?.profileId;
  }
}
