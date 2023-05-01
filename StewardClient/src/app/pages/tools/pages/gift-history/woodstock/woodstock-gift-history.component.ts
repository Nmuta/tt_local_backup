import { Component, OnInit } from '@angular/core';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Observable } from 'rxjs';
import { takeUntil, debounceTime, filter } from 'rxjs/operators';
import { GameTitleCodeName } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { Select, Store } from '@ngxs/store';
import { GiftHistoryBaseComponent } from '../base/gift-history.base.component';
import { WoodstockGiftHistoryState } from './state/woodstock-gift-history.state';
import {
  SetWoodstockGiftHistoryMatTabIndex,
  SetWoodstockGiftHistorySelectedPlayerIdentities,
} from './state/woodstock-gift-history.state.actions';
import { first } from 'lodash';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { WoodstockMasterInventory } from '@models/woodstock';
import BigNumber from 'bignumber.js';
import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { HCI } from '@environments/environment';
import { DateTimeRange } from '@models/datetime-range';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DATE_TIME_TOGGLE_OPTIONS } from '@components/date-time-pickers/datetime-range-picker/datetime-range-toggle-defaults';
import { DateRangePickerFormValue } from '@components/date-time-pickers/datetime-range-picker/date-range-picker/date-range-picker.component';
import { PlayerInventoryProfile } from '@models/player-inventory-profile';

/** The gift history page for the Navbar app. */
@Component({
  templateUrl: './woodstock-gift-history.component.html',
  styleUrls: ['./woodstock-gift-history.component.scss'],
})
export class WoodstockGiftHistoryComponent
  extends GiftHistoryBaseComponent<BigNumber>
  implements OnInit
{
  @Select(WoodstockGiftHistoryState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultAlphaBatch>;

  public title: GameTitleCodeName = GameTitleCodeName.FH5;
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultAlpha;
  public selectedPlayerInventoryProfile: PlayerInventoryProfile;
  public selectedPlayerInventory: WoodstockMasterInventory;
  public selectedLspGroup: LspGroup;
  public selectedPlayer: IdentityResultAlpha;

  public dateRangeToggleOptions = DATE_TIME_TOGGLE_OPTIONS;
  public formControls = {
    dateRange: new FormControl({
      value: {
        start: DateTime.local().minus({ days: 7 }),
        end: DateTime.local(),
      } as DateRangePickerFormValue,
      disabled: true,
    }),
  };
  public selectedDateTime: DateTimeRange;

  constructor(private readonly store: Store) {
    super();
  }

  /** Initialization hook */
  public ngOnInit(): void {
    this.matTabSelectedIndex = this.store.selectSnapshot<number>(
      WoodstockGiftHistoryState.selectedMatTabIndex,
    );

    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultAlphaBatch) => {
        this.selectedPlayerIdentities = playerIdentities;
        this.selectedPlayer = first(this.selectedPlayerIdentities);
      });

    this.formControls.dateRange.valueChanges
      .pipe(
        debounceTime(HCI.TypingToAutoSearchDebounceMillis),
        filter(() => !!this.selectedDateTime), // Undefined when toggle is off
        filter(value => !!value.start && !!value.end),
        takeUntil(this.onDestroy$),
      )
      .subscribe(value => {
        this.selectedDateTime = value;
      });
  }

  /** Tracks when the mat tab is changed  */
  public matTabSelectionChange(index: number): void {
    this.store.dispatch(new SetWoodstockGiftHistoryMatTabIndex(index));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentityChange(identity: AugmentedCompositeIdentity): void {
    const newIdentities = [identity].filter(i => i?.extra?.hasWoodstock).map(i => i.woodstock);
    this.store.dispatch(new SetWoodstockGiftHistorySelectedPlayerIdentities(newIdentities));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity?.extra?.hasWoodstock ? identity.woodstock : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: WoodstockMasterInventory): void {
    this.selectedPlayerInventory = inventory;
  }

  /** Logic when datetime filter toggle is clicked. */
  public toggleDatetimeFilter(toggleEvent: MatSlideToggleChange): void {
    this.selectedDateTime = toggleEvent.checked ? this.formControls.dateRange.value : undefined;

    if (toggleEvent.checked) {
      this.formControls.dateRange.enable();
    } else {
      this.formControls.dateRange.disable();
    }
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasWoodstock) {
      return 'Player does not have a woodstock account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }

  /** Called when a new profile is picked. */
  public onProfileChange(newProfile: PlayerInventoryProfile): void {
    this.selectedPlayerInventoryProfileId = newProfile?.profileId;
  }
}
