import { Component, forwardRef } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { ActivePipelineService } from '@data-pipeline-app/pages/obligation/services/active-pipeline.service';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { StringValidators } from '@shared/validators/string-validators';
import { DateTime } from 'luxon';
import {
  KustoFunctionComponent,
  KustoFunctionOptions,
} from '../../kusto-function/kusto-function.component';

export interface ObligationDataActivityOptions {
  name: string;
  table: string;
  database: string;
  query: KustoFunctionOptions;
  dateRange: {
    start: DateTime;
    end: DateTime;
  };
  maximumExecutionTimeInMinutes: number;
  executionIntervalInMinutes: number;
  executionDelayInMinutes: number;
  parallelismLimit: number;
  dependencyNames: string[];
}

/** A form component for a single pipeline activity. */
@Component({
  selector: 'obligation-data-activity',
  templateUrl: './obligation-data-activity.component.html',
  styleUrls: ['./obligation-data-activity.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ObligationDataActivityComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ObligationDataActivityComponent),
      multi: true,
    },
  ],
})
export class ObligationDataActivityComponent implements ControlValueAccessor, Validator {
  private static readonly UTC_NOW = DateTime.utc();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public static defaults: ObligationDataActivityOptions = {
    name: '',
    table: '',
    database: 'T10Analytics',
    query: KustoFunctionComponent.defaults,
    dateRange: {
      start: ObligationDataActivityComponent.UTC_NOW,
      end: ObligationDataActivityComponent.UTC_NOW.plus({ days: 7 }),
    },
    maximumExecutionTimeInMinutes: 1440,
    executionIntervalInMinutes: 1440,
    executionDelayInMinutes: 2880,
    dependencyNames: [],
    parallelismLimit: 2,
  };

  public formControls = {
    name: new FormControl(ObligationDataActivityComponent.defaults.name, [
      Validators.required,
      StringValidators.trim,
      StringValidators.uniqueInList(() => this.activePipeline.activityNames),
    ]),
    table: new FormControl(ObligationDataActivityComponent.defaults.table, [
      Validators.required,
      StringValidators.trim,
    ]),
    database: new FormControl(ObligationDataActivityComponent.defaults.database, [
      Validators.required,
      StringValidators.trim,
    ]),
    query: new FormControl(ObligationDataActivityComponent.defaults.query, [Validators.required]),
    dateRange: new FormControl(ObligationDataActivityComponent.defaults.dateRange),
    maximumExecutionTimeInMinutes: new FormControl(
      ObligationDataActivityComponent.defaults.maximumExecutionTimeInMinutes,
      [Validators.required, Validators.min(60), Validators.max(1440)],
    ),
    executionIntervalInMinutes: new FormControl(
      ObligationDataActivityComponent.defaults.executionIntervalInMinutes,
      [Validators.required],
    ),
    executionDelayInMinutes: new FormControl(
      ObligationDataActivityComponent.defaults.executionDelayInMinutes,
      [Validators.required],
    ),
    parallelismLimit: new FormControl(ObligationDataActivityComponent.defaults.parallelismLimit, [
      Validators.required,
      Validators.min(1),
      Validators.max(5),
    ]),
    dependencyNames: new FormControl(ObligationDataActivityComponent.defaults.dependencyNames),
  };

  public formGroup = new FormGroup({
    name: this.formControls.name,
    table: this.formControls.table,
    database: this.formControls.database,
    query: this.formControls.query,
    dateRange: this.formControls.dateRange,
    maximumExecutionTimeInMinutes: this.formControls.maximumExecutionTimeInMinutes,
    executionIntervalInMinutes: this.formControls.executionIntervalInMinutes,
    executionDelayInMinutes: this.formControls.executionDelayInMinutes,
    parallelismLimit: this.formControls.parallelismLimit,
    dependencyNames: this.formControls.dependencyNames,
  });

  constructor(private readonly activePipeline: ActivePipelineService) {
    this.formGroup.valueChanges.subscribe(data => this.changeFn(data));
  }

  /** Form control hook. */
  public writeValue(data: { [key: string]: unknown }): void {
    if (data) {
      this.formGroup.patchValue(data, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: ObligationDataActivityOptions) => void): void {
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

  private changeFn = (_data: ObligationDataActivityOptions) => {
    /* Empty */
  };
}
