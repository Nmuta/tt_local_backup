import { Component, OnInit } from '@angular/core';
import { GameTitleCodeName } from '@models/enums';
import { IdentityResultBeta, IdentityResultBetaBatch } from '@models/identity-query.model';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { GiftHistoryBaseComponent } from '../base/gift-history.base.component';
import { GravityGiftHistoryState } from './state/gravity-gift-history.state';
import { SetGravitySelectedPlayerIdentities } from './state/gravity-gift-history.state.actions';
import { first } from 'lodash';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { GravityPlayerInventory, GravityPseudoPlayerInventoryProfile } from '@models/gravity';
import { DATE_TIME_TOGGLE_OPTIONS } from '../gift-history-defaults';
import { FormControl } from '@angular/forms';
import { DateTime } from 'luxon';
import { HCI } from '@environments/environment';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DateTimeRange } from '@models/datetime-range';
import { DateRangePickerFormValue } from '@components/datetime-range-picker/date-range-picker/date-range-picker.component';

/** The gravity gift history page for the Navbar app. */
@Component({
  templateUrl: './gravity-gift-history.component.html',
  styleUrls: ['./gravity-gift-history.component.scss'],
})
export class GravityGiftHistoryComponent
  extends GiftHistoryBaseComponent<string>
  implements OnInit
{
  @Select(GravityGiftHistoryState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultBetaBatch>;

  public title: GameTitleCodeName = GameTitleCodeName.Street;
  public selectedPlayerIdentities: IdentityResultBetaBatch;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultBeta;
  public selectedPlayerInventoryProfile: GravityPseudoPlayerInventoryProfile;
  public selectedPlayerInventory: GravityPlayerInventory;
  public selectedPlayer: IdentityResultBeta;

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
    this.selectedPlayerIdentities$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((playerIdentities: IdentityResultBetaBatch) => {
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

  /** Logic when player selection outputs identities. */
  public onPlayerIdentityChange(identity: AugmentedCompositeIdentity): void {
    const newIdentities = [identity].filter(i => i?.extra?.hasGravity).map(i => i.gravity);
    this.store.dispatch(new SetGravitySelectedPlayerIdentities(newIdentities));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity?.extra?.hasGravity ? identity.gravity : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: GravityPlayerInventory): void {
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
    if (!identity?.extra?.hasGravity) {
      return 'Player does not have a gravity account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }
}
