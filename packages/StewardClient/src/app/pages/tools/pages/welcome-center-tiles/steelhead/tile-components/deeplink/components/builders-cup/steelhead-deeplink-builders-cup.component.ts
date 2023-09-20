import { Component, forwardRef } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  UntypedFormControl,
  UntypedFormGroup,
  AbstractControl,
  ValidationErrors,
  ControlValueAccessor,
  Validator,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { collectErrors } from '@helpers/form-group-collect-errors';
import {
  BuildersCupDestination,
  BuildersCupSettingType,
  DeeplinkDestination,
  DestinationType,
} from '@models/welcome-center';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { combineLatest, filter, map, pairwise, startWith, takeUntil } from 'rxjs';
import { SteelheadBuildersCupService } from '@services/api-v2/steelhead/builders-cup/steelhead-builders-cup.service';

/** The deeplink builders cup component. */
@Component({
  selector: 'steelhead-deeplink-builders-cup',
  templateUrl: './steelhead-deeplink-builders-cup.component.html',
  styleUrls: ['../../steelhead-deeplink-tile.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DeeplinkBuildersCupComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DeeplinkBuildersCupComponent),
      multi: true,
    },
  ],
})
export class DeeplinkBuildersCupComponent
  extends BaseComponent
  implements ControlValueAccessor, Validator
{
  public buildersCupSetting: string[] = [
    BuildersCupSettingType.Homepage,
    BuildersCupSettingType.Ladder,
    BuildersCupSettingType.Series,
  ];
  public buildersCupSettingTypes = BuildersCupSettingType;
  public buildersCupChampionships: Map<string, string>;
  public buildersCupSeries: Map<string, string>;
  public buildersCupLadders: Map<string, string>;
  public referenceDataMonitor = new ActionMonitor('GET Reference Data');

  public formControls = {
    buildersCupSettingType: new UntypedFormControl(null, [Validators.required]),
    buildersCupChampionship: new UntypedFormControl(null),
    buildersCupLadder: new UntypedFormControl(null),
    buildersCupSeries: new UntypedFormControl(null),
  };

  public formGroup: UntypedFormGroup = new UntypedFormGroup(this.formControls);

  constructor(steelheadBuildersCupService: SteelheadBuildersCupService) {
    super();

    if (!this.buildersCupChampionships || !this.buildersCupLadders || !this.buildersCupSeries) {
      const getBuildersCupChampionships$ = steelheadBuildersCupService.getBuildersCupChampionships$(
        'dev',
        'daily',
      );
      const getBuildersCupLadders$ = steelheadBuildersCupService.getBuildersCupLadders$(
        'dev',
        'daily',
      );
      const getBuildersCupSeries$ = steelheadBuildersCupService.getBuildersCupSeries$(
        'dev',
        'daily',
      );

      this.referenceDataMonitor = this.referenceDataMonitor.repeat();
      combineLatest([getBuildersCupChampionships$, getBuildersCupLadders$, getBuildersCupSeries$])
        .pipe(this.referenceDataMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
        .subscribe(([championships, ladders, series]) => {
          this.buildersCupChampionships = championships;
          this.buildersCupLadders = ladders;
          this.buildersCupSeries = series;
        });
    }

    this.formControls.buildersCupSettingType.valueChanges.subscribe(
      (value: BuildersCupSettingType) => {
        this.formControls.buildersCupChampionship.removeValidators([Validators.required]);
        this.formControls.buildersCupLadder.removeValidators([Validators.required]);
        this.formControls.buildersCupSeries.removeValidators([Validators.required]);

        if (value == BuildersCupSettingType.Series) {
          this.formControls.buildersCupChampionship.addValidators([Validators.required]);
          this.formControls.buildersCupSeries.addValidators([Validators.required]);
        } else if (value == BuildersCupSettingType.Ladder) {
          this.formControls.buildersCupChampionship.addValidators([Validators.required]);
          this.formControls.buildersCupLadder.addValidators([Validators.required]);
        }

        this.formControls.buildersCupChampionship.updateValueAndValidity();
        this.formControls.buildersCupLadder.updateValueAndValidity();
        this.formControls.buildersCupSeries.updateValueAndValidity();
      },
    );
  }

  /** Form control hook. */
  public writeValue(data: DeeplinkDestination): void {
    const buildersCupDestination = data as BuildersCupDestination;
    if (
      Object.values(BuildersCupSettingType).includes(
        buildersCupDestination.settingType as BuildersCupSettingType,
      )
    ) {
      this.formControls.buildersCupSettingType.setValue(buildersCupDestination.settingType);
    }

    if (buildersCupDestination.settingType == BuildersCupSettingType.Ladder) {
      this.formControls.buildersCupChampionship.setValue(buildersCupDestination.championship);
      this.formControls.buildersCupLadder.setValue(buildersCupDestination.ladder);
    }
    if (buildersCupDestination.settingType == BuildersCupSettingType.Series) {
      this.formControls.buildersCupChampionship.setValue(buildersCupDestination.championship);
      this.formControls.buildersCupSeries.setValue(buildersCupDestination.series);
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: BuildersCupDestination) => void): void {
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
        const buildersCupDestination = {
          settingType: this.formControls.buildersCupSettingType.value,
          destinationType: DestinationType.BuildersCup,
        } as BuildersCupDestination;

        if (buildersCupDestination.settingType == BuildersCupSettingType.Ladder) {
          buildersCupDestination.championship = this.formControls.buildersCupChampionship.value;
          buildersCupDestination.ladder = this.formControls.buildersCupLadder.value;
        }
        if (buildersCupDestination.settingType == BuildersCupSettingType.Series) {
          buildersCupDestination.championship = this.formControls.buildersCupChampionship.value;
          buildersCupDestination.series = this.formControls.buildersCupSeries.value;
        }

        fn(buildersCupDestination);
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
