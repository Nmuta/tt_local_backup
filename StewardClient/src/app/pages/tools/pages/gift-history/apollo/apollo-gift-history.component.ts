import { Component, OnInit } from '@angular/core';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Observable } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { GameTitleCodeName } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { Select, Store } from '@ngxs/store';
import { GiftHistoryBaseComponent } from '../base/gift-history.base.component';
import { ApolloGiftHistoryState } from './state/apollo-gift-history.state';
import {
  SetApolloGiftHistoryMatTabIndex,
  SetApolloGiftHistorySelectedPlayerIdentities,
} from './state/apollo-gift-history.state.actions';
import { first } from 'lodash';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { ApolloMasterInventory } from '@models/apollo';
import BigNumber from 'bignumber.js';
import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { HCI } from '@environments/environment';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DateTimeRange } from '@models/datetime-range';
import { DATE_TIME_TOGGLE_OPTIONS } from '@components/date-time-pickers/datetime-range-picker/datetime-range-toggle-defaults';
import { DateRangePickerFormValue } from '@components/date-time-pickers/datetime-range-picker/date-range-picker/date-range-picker.component';
import { ExtendedPlayerInventoryProfile } from '@models/player-inventory-profile';

/** The gift history page for the Navbar app. */
@Component({
  templateUrl: './apollo-gift-history.component.html',
  styleUrls: ['./apollo-gift-history.component.scss'],
})
export class ApolloGiftHistoryComponent
  extends GiftHistoryBaseComponent<BigNumber>
  implements OnInit
{
  @Select(ApolloGiftHistoryState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultAlphaBatch>;

  public title: GameTitleCodeName = GameTitleCodeName.FM7;
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultAlpha;
  public selectedPlayerInventory: ApolloMasterInventory;
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
      ApolloGiftHistoryState.selectedMatTabIndex,
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
    this.store.dispatch(new SetApolloGiftHistoryMatTabIndex(index));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentityChange(identity: AugmentedCompositeIdentity): void {
    const newIdentities = [identity].filter(i => i?.extra?.hasApollo).map(i => i.apollo);
    this.store.dispatch(new SetApolloGiftHistorySelectedPlayerIdentities(newIdentities));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity?.extra?.hasApollo ? identity.apollo : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: ApolloMasterInventory): void {
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
    if (!identity?.extra?.hasApollo) {
      return 'Player does not have an apollo account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }

  /** Called when a new profile is picked. */
  public onProfileChange(newProfile: ExtendedPlayerInventoryProfile): void {
    this.selectedPlayerInventoryProfileId = newProfile?.profileId;
  }
}
