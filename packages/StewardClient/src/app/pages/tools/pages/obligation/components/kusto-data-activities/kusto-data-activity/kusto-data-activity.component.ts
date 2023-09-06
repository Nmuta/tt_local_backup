import { AfterViewInit, Component, forwardRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormControl,
  UntypedFormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { DataActivityCreationBehavior } from '@models/pipelines/data-activity-creation-behavior';
import { ActivePipelineService } from '@tools-app/pages/obligation/services/active-pipeline.service';
import { StringValidators } from '@shared/validators/string-validators';
import { DateTime } from 'luxon';
import { map } from 'rxjs/operators';
import {
  KustoFunctionComponent,
  KustoFunctionOptions,
} from '../kusto-function/kusto-function.component';
import { DatetimeRangePickerFormValue } from '@components/date-time-pickers/datetime-range-picker/datetime-range-picker.component';

export interface KustoDataActivityOptions {
  name: string;
  table: string;
  database: string;
  query: KustoFunctionOptions;
  dateRange: DatetimeRangePickerFormValue;
  maximumExecutionTimeInMinutes: number;
  executionIntervalInMinutes: number;
  executionDelayInMinutes: number;
  parallelismLimit: number;
  isTimeAgnostic: boolean;
  dependencyNames: string[];
  selfDependency: boolean;
  creationBehavior: DataActivityCreationBehavior;

  /** True when this model was retrieved from the API. UI-only value. Disables some controls. */
  fromApi: boolean;
}

/** A form component for a single kusto pipeline activity. */
@Component({
  selector: 'kusto-data-activity',
  templateUrl: './kusto-data-activity.component.html',
  styleUrls: ['./kusto-data-activity.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KustoDataActivityComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => KustoDataActivityComponent),
      multi: true,
    },
  ],
})
export class KustoDataActivityComponent implements AfterViewInit, ControlValueAccessor, Validator {
  private static readonly UTC_NOW = DateTime.utc();

  @ViewChild('kustoFunction') public kustoFunction: KustoFunctionComponent;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public static defaults: KustoDataActivityOptions = {
    name: '',
    table: '',
    database: 'T10Analytics',
    query: KustoFunctionComponent.defaults,
    dateRange: {
      start: KustoDataActivityComponent.UTC_NOW.startOf('day').toUTC(),
      end: KustoDataActivityComponent.UTC_NOW.plus({ days: 7 }).startOf('day').toUTC(),
    },
    maximumExecutionTimeInMinutes: 1440,
    executionIntervalInMinutes: 1440,
    executionDelayInMinutes: 2880,
    isTimeAgnostic: false,
    dependencyNames: [],
    selfDependency: false,
    parallelismLimit: 2,
    creationBehavior: DataActivityCreationBehavior.Full,
    fromApi: false,
  };

  public formControls = {
    name: new UntypedFormControl(KustoDataActivityComponent.defaults.name, [
      Validators.required,
      StringValidators.trim,
      StringValidators.uniqueInList(() => this.activePipeline.activityNames),
    ]),
    table: new UntypedFormControl(KustoDataActivityComponent.defaults.table, [
      Validators.required,
      StringValidators.trim,
    ]),
    database: new UntypedFormControl(KustoDataActivityComponent.defaults.database, [
      Validators.required,
      StringValidators.trim,
    ]),
    query: new UntypedFormControl(KustoDataActivityComponent.defaults.query, [Validators.required]),
    dateRange: new UntypedFormControl(KustoDataActivityComponent.defaults.dateRange),
    maximumExecutionTimeInMinutes: new UntypedFormControl(
      KustoDataActivityComponent.defaults.maximumExecutionTimeInMinutes,
      [Validators.required, Validators.min(60), Validators.max(1440)],
    ),
    executionIntervalInMinutes: new UntypedFormControl(
      KustoDataActivityComponent.defaults.executionIntervalInMinutes,
      [Validators.required],
    ),
    executionDelayInMinutes: new UntypedFormControl(
      KustoDataActivityComponent.defaults.executionDelayInMinutes,
      [Validators.required],
    ),
    parallelismLimit: new UntypedFormControl(KustoDataActivityComponent.defaults.parallelismLimit, [
      Validators.required,
      Validators.min(1),
      Validators.max(25),
    ]),
    isTimeAgnostic: new UntypedFormControl(KustoDataActivityComponent.defaults.isTimeAgnostic),
    dependencyNames: new UntypedFormControl(KustoDataActivityComponent.defaults.dependencyNames),
    selfDependency: new UntypedFormControl(false),
    creationBehavior: new UntypedFormControl(KustoDataActivityComponent.defaults.creationBehavior),
    fromApi: new UntypedFormControl(KustoDataActivityComponent.defaults.fromApi),
  };

  public formGroup = new UntypedFormGroup({
    name: this.formControls.name,
    table: this.formControls.table,
    database: this.formControls.database,
    query: this.formControls.query,
    dateRange: this.formControls.dateRange,
    maximumExecutionTimeInMinutes: this.formControls.maximumExecutionTimeInMinutes,
    executionIntervalInMinutes: this.formControls.executionIntervalInMinutes,
    executionDelayInMinutes: this.formControls.executionDelayInMinutes,
    parallelismLimit: this.formControls.parallelismLimit,
    isTimeAgnostic: this.formControls.isTimeAgnostic,
    dependencyNames: this.formControls.dependencyNames,
    selfDependency: this.formControls.selfDependency,
    creationBehavior: this.formControls.creationBehavior,
    fromApi: this.formControls.fromApi,
  });

  constructor(private readonly activePipeline: ActivePipelineService) {}

  /** Angular lifecycle hook. */
  public ngAfterViewInit(): void {
    this.formGroup.valueChanges
      .pipe(map(_ => this.formGroup.getRawValue())) // we need to map this to the raw value to include the disabled form controls
      .subscribe(data => this.changeFn(data));

    this.formControls.isTimeAgnostic.valueChanges.subscribe(isTimeAgnostic => {
      if (isTimeAgnostic) {
        this.formControls.maximumExecutionTimeInMinutes.disable();
      } else {
        this.formControls.maximumExecutionTimeInMinutes.enable();
      }

      this.kustoFunction.isTimeAgnostic = isTimeAgnostic;
    });
  }

  /** Form control hook. */
  public writeValue(data: KustoDataActivityOptions): void {
    if (data) {
      this.formGroup.patchValue(data, { emitEvent: false });

      if (data.fromApi) {
        this.formControls.dateRange.disable();
        this.formControls.name.disable();
        this.formControls.creationBehavior.disable();
        this.formControls.isTimeAgnostic.disable();
      } else {
        this.formControls.dateRange.enable();
        this.formControls.name.enable();
        this.formControls.creationBehavior.enable();
        this.formControls.isTimeAgnostic.enable();
      }
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: KustoDataActivityOptions) => void): void {
    this.changeFn = fn;
    this.changeFn(this.formGroup.value);
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

  private changeFn = (_data: KustoDataActivityOptions) => {
    // empty
  };
}
