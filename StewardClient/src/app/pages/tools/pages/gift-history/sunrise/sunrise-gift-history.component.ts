import { Component, OnInit } from '@angular/core';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { Observable } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { GameTitleCodeName } from '@models/enums';
import { LspGroup } from '@models/lsp-group';
import { Select, Store } from '@ngxs/store';
import { GiftHistoryBaseComponent } from '../base/gift-history.base.component';
import { SunriseGiftHistoryState } from './state/sunrise-gift-history.state';
import {
  SetSunriseGiftHistoryMatTabIndex,
  SetSunriseGiftHistorySelectedPlayerIdentities,
} from './state/sunrise-gift-history.state.actions';
import { first } from 'lodash';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { SunriseMasterInventory } from '@models/sunrise';
import BigNumber from 'bignumber.js';
import { FormControl } from '@angular/forms';
import { DateTimeRange } from '@models/datetime-range';
import { DateTime } from 'luxon';
import { DATE_TIME_TOGGLE_OPTIONS } from '../gift-history-defaults';
import { HCI } from '@environments/environment';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { DateRangePickerFormValue } from '@components/datetime-range-picker/date-range-picker/date-range-picker.component';

/** The gift history page for the Navbar app. */
@Component({
  templateUrl: './sunrise-gift-history.component.html',
  styleUrls: ['./sunrise-gift-history.component.scss'],
})
export class SunriseGiftHistoryComponent
  extends GiftHistoryBaseComponent<BigNumber>
  implements OnInit
{
  @Select(SunriseGiftHistoryState.selectedPlayerIdentities)
  public selectedPlayerIdentities$: Observable<IdentityResultAlphaBatch>;

  public title: GameTitleCodeName = GameTitleCodeName.FH4;
  public selectedPlayerIdentities: IdentityResultAlphaBatch;
  /** Selected player identity when user clicks on identity chip. */
  public selectedPlayerIdentity: IdentityResultAlpha;
  public selectedPlayerInventory: SunriseMasterInventory;
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
      SunriseGiftHistoryState.selectedMatTabIndex,
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
    this.store.dispatch(new SetSunriseGiftHistoryMatTabIndex(index));
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentityChange(identity: AugmentedCompositeIdentity): void {
    const newIdentities = [identity].filter(i => i?.extra?.hasSunrise).map(i => i.sunrise);
    this.store.dispatch(new SetSunriseGiftHistorySelectedPlayerIdentities(newIdentities));
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayerIdentity = identity?.extra?.hasSunrise ? identity.sunrise : null;
  }

  /** Called when a player inventory is selected and found. */
  public onInventoryFound(inventory: SunriseMasterInventory): void {
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
    if (!identity?.extra?.hasSunrise) {
      return 'Player does not have a sunrise account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }
}
