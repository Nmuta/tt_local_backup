import { Component, forwardRef } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  ControlValueAccessor,
  Validator,
} from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { collectErrors } from '@helpers/form-group-collect-errors';
import {
  DeeplinkDestination,
  DestinationType,
  RivalsDestination,
  RivalsSettingType,
} from '@models/welcome-center';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { combineLatest, filter, map, pairwise, startWith, takeUntil } from 'rxjs';
import { SteelheadRivalsService } from '@services/api-v2/steelhead/rivals/steelhead-rivals.service';

/** The deeplink rivals component. */
@Component({
  selector: 'steelhead-deeplink-rivals',
  templateUrl: './steelhead-deeplink-rivals.component.html',
  styleUrls: ['../../steelhead-deeplink-tile.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeeplinkRivalsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DeeplinkRivalsComponent),
      multi: true,
    },
  ],
})
export class DeeplinkRivalsComponent
  extends BaseComponent
  implements ControlValueAccessor, Validator
{
  public rivalsSetting: string[] = [
    RivalsSettingType.Homepage,
    RivalsSettingType.Event,
    RivalsSettingType.Category,
  ];
  public rivalsEvents: Map<string, string>;
  public rivalsCategories: Map<string, string>;
  public rivalsSettingTypes = RivalsSettingType;
  public referenceDataMonitor = new ActionMonitor('GET Reference Data');

  public formControls = {
    rivalsSettingType: new FormControl(null),
    rivalsCategory: new FormControl(null),
    rivalsEvent: new FormControl(null),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  constructor(steelheadRivalsService: SteelheadRivalsService) {
    super();

    const getRivalsCategories$ = steelheadRivalsService.getRivalsEventCategories$();
    const getRivalsEvents$ = steelheadRivalsService.getRivalsEventReference$();

    this.referenceDataMonitor = this.referenceDataMonitor.repeat();
    combineLatest([getRivalsCategories$, getRivalsEvents$])
      .pipe(this.referenceDataMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(([categories, events]) => {
        this.rivalsCategories = categories;
        this.rivalsEvents = events;
      });
  }

  /** Form control hook. */
  public writeValue(data: DeeplinkDestination): void {
    const rivalsDestination = data as RivalsDestination;
    this.formControls.rivalsSettingType.setValue(rivalsDestination.settingType);

    if (rivalsDestination.settingType == RivalsSettingType.Category) {
      this.formControls.rivalsCategory.setValue(rivalsDestination.category);
    }
    if (rivalsDestination.settingType == RivalsSettingType.Event) {
      this.formControls.rivalsCategory.setValue(rivalsDestination.category);
      this.formControls.rivalsEvent.setValue(rivalsDestination.event);
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: RivalsDestination) => void): void {
    this.formGroup.valueChanges
      .pipe(
        startWith(null),
        pairwise(),
        filter(([prev, cur]) => {
          return prev !== cur;
        }),
        map(([_prev, cur]) => cur),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        const rivalsDestination = {
          settingType: this.formControls.rivalsSettingType.value,
          destinationType: DestinationType.Rivals,
        } as RivalsDestination;

        if (rivalsDestination.settingType == RivalsSettingType.Category) {
          rivalsDestination.category = this.formControls.rivalsCategory.value;
        }
        if (rivalsDestination.settingType == RivalsSettingType.Event) {
          rivalsDestination.category = this.formControls.rivalsCategory.value;
          rivalsDestination.event = this.formControls.rivalsEvent.value;
        }

        fn(rivalsDestination);
      });
  }

  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null {
    if (this.formGroup.invalid) {
      return collectErrors(this.formGroup);
    }

    return null;
  }
}
