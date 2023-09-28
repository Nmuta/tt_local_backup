import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { PegasusPathInfo } from '@models/pegasus-path-info';
import { Observable, map, startWith } from 'rxjs';
import { GameTitle } from '@models/enums';
import { SteelheadPegasusSlotsService } from '@services/api-v2/steelhead/pegasus-slots/steelhead-pegasus-slots.service';

export type CalendarLookupInputs = {
  identity?: IdentityResultAlpha;
  pegasusInfo?: PegasusPathInfo;
  daysForward?: number;
};

export interface CalendarLookupInputsServiceContract {
  title: GameTitle;
  getPegasusSlots$(environment: string): Observable<string[]>;
}

/** Inputs for calendar lookup. */
@Component({
  selector: 'calendar-lookup-inputs',
  templateUrl: './calendar-lookup-inputs.component.html',
  styleUrls: ['./calendar-lookup-inputs.component.scss'],
})
export class CalendarLookupInputsComponent implements OnInit {
  /** Inputs for calendar lookup.  */
  @Input() public requireDaysForward = true;

  /** Outputs for calendar lookup.  */
  @Output() public playerAndDaysForward = new EventEmitter<CalendarLookupInputs>();
  public matTabSelectedIndex = 0;

  public identityFormControls = {
    daysForward: new UntypedFormControl(30, [Validators.min(1)]),
    identity: new UntypedFormControl(null, [Validators.required]),
  };
  public identityCalendarScheduleForm: UntypedFormGroup = new UntypedFormGroup(
    this.identityFormControls,
  );

  public pegasusFormControls = {
    daysForward: new UntypedFormControl(30, [Validators.min(1)]),
    pegasusEnvironment: new UntypedFormControl(null, [Validators.required]),
    pegasusSlot: new UntypedFormControl(null),
    pegasusSnapshot: new UntypedFormControl(null),
  };
  public pegasusCalendarScheduleForm: UntypedFormGroup = new UntypedFormGroup(
    this.pegasusFormControls,
  );

  public environmentOptions: string[] = ['Prod', 'Dev'];
  public slotOptions: string[];
  public filteredSlots: Observable<string[]>;

  constructor(private readonly slotsService: SteelheadPegasusSlotsService){}

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (this.requireDaysForward) {
      this.identityFormControls.daysForward.addValidators([Validators.required]);
      this.pegasusFormControls.daysForward.addValidators([Validators.required]);
    }

    this.slotsService.getPegasusSlots$().subscribe(slotsResponse => {
      this.slotOptions = slotsResponse

      this.filteredSlots = this.pegasusFormControls.pegasusSlot.valueChanges.pipe(
        startWith(''),
        map(state => (state ? this.filterSlots(state) : this.slotOptions.slice())),
      );
    });
  }

  /** Filter slot selection based on input into pegasusSlot formcontrol. */
  public filterSlots(input: string): string[] {
    return this.slotOptions.filter(slot => slot.toLowerCase().indexOf(input.toLowerCase()) === 0);
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasSteelhead) {
      return 'Player does not have a steelhead account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }

  /** Player identity selected. */
  public playerIdentityFound(newIdentity: AugmentedCompositeIdentity): void {
    if (newIdentity?.steelhead?.error) {
      return;
    }

    this.identityFormControls.identity.setValue(newIdentity?.steelhead);
  }

  /** Output values for calendar lookup. */
  public submitClicked(): void {
    // Using identity lookup
    if (this.matTabSelectedIndex == 0) {
      if (this.identityFormControls.identity) {
        this.playerAndDaysForward.emit({
          identity: this.identityFormControls.identity.value,
          daysForward: this.identityFormControls.daysForward.value,
        });
      }
    }
    // Using Pegasus lookup
    else if (this.matTabSelectedIndex == 1) {
      const info: PegasusPathInfo = {
        environment: this.pegasusFormControls.pegasusEnvironment.value,
        slot: this.pegasusFormControls.pegasusSlot.value,
        snapshot: this.pegasusFormControls.pegasusSnapshot.value,
      };
      this.playerAndDaysForward.emit({
        pegasusInfo: info,
        daysForward: this.pegasusFormControls.daysForward.value,
      });
    }
  }
}
