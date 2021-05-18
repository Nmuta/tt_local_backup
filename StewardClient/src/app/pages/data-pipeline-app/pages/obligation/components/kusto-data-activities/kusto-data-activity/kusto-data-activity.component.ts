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
} from '../kusto-function/kusto-function.component';

export interface KustoDataActivityOptions {
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
export class KustoDataActivityComponent implements ControlValueAccessor, Validator {
  private static readonly UTC_NOW = DateTime.utc();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  public static defaults: KustoDataActivityOptions = {
    name: '',
    table: '',
    database: 'T10Analytics',
    query: KustoFunctionComponent.defaults,
    dateRange: {
      start: KustoDataActivityComponent.UTC_NOW,
      end: KustoDataActivityComponent.UTC_NOW.plus({ days: 7 }),
    },
    maximumExecutionTimeInMinutes: 1440,
    executionIntervalInMinutes: 1440,
    executionDelayInMinutes: 2880,
    dependencyNames: [],
    parallelismLimit: 2,
  };

  public formControls = {
    name: new FormControl(KustoDataActivityComponent.defaults.name, [
      Validators.required,
      StringValidators.trim,
      StringValidators.uniqueInList(() => this.activePipeline.activityNames),
    ]),
    table: new FormControl(KustoDataActivityComponent.defaults.table, [
      Validators.required,
      StringValidators.trim,
    ]),
    database: new FormControl(KustoDataActivityComponent.defaults.database, [
      Validators.required,
      StringValidators.trim,
    ]),
    query: new FormControl(KustoDataActivityComponent.defaults.query, [Validators.required]),
    dateRange: new FormControl(KustoDataActivityComponent.defaults.dateRange),
    maximumExecutionTimeInMinutes: new FormControl(
      KustoDataActivityComponent.defaults.maximumExecutionTimeInMinutes,
      [Validators.required, Validators.min(60), Validators.max(1440)],
    ),
    executionIntervalInMinutes: new FormControl(
      KustoDataActivityComponent.defaults.executionIntervalInMinutes,
      [Validators.required],
    ),
    executionDelayInMinutes: new FormControl(
      KustoDataActivityComponent.defaults.executionDelayInMinutes,
      [Validators.required],
    ),
    parallelismLimit: new FormControl(KustoDataActivityComponent.defaults.parallelismLimit, [
      Validators.required,
      Validators.min(1),
      Validators.max(5),
    ]),
    dependencyNames: new FormControl(KustoDataActivityComponent.defaults.dependencyNames),
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
    /* Empty */
  };
}
