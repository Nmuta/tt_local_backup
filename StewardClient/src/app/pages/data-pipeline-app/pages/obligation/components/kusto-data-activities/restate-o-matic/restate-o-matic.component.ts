import { AfterViewInit, Component, forwardRef, Input } from '@angular/core';
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
import { BaseComponent } from '@components/base-component/base.component';
import { ActivePipelineService } from '@data-pipeline-app/pages/obligation/services/active-pipeline.service';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { DataActivityCreationBehavior } from '@models/pipelines/data-activity-creation-behavior';
import { StringValidators } from '@shared/validators/string-validators';
import { DateTime } from 'luxon';
import { Observable, of, ReplaySubject } from 'rxjs';
import { map, mergeMap, startWith, takeUntil } from 'rxjs/operators';
import { KustoDataActivityOptions } from '../kusto-data-activity/kusto-data-activity.component';
import {
  KustoFunctionComponent,
  KustoFunctionOptions,
} from '../kusto-function/kusto-function.component';

export interface KustoRestateOMaticDataActivityOptions {
  name: string;
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
  includeChildren: boolean;
  creationBehavior: DataActivityCreationBehavior;

  /** True when this model was retrieved from the API. UI-only value. Disables some controls. */
  fromApi: boolean;
}

/** A form component for a single kusto restate-o-matic pipeline activity. */
@Component({
  selector: 'restate-o-matic',
  templateUrl: './restate-o-matic.component.html',
  styleUrls: ['./restate-o-matic.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RestateOMaticComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RestateOMaticComponent),
      multi: true,
    },
  ],
})
export class RestateOMaticComponent
  extends BaseComponent
  implements ControlValueAccessor, Validator, AfterViewInit {
  public static readonly NAME_PREFIX = 'ROM_';
  private static readonly UTC_NOW = DateTime.utc();
  private readonly attachedToFormControl$ = new ReplaySubject<FormControl>(1);
  private readonly attachedToFormControlValue$: Observable<
    KustoDataActivityOptions
  > = this.attachedToFormControl$.pipe(
    takeUntil(this.onDestroy$),
    mergeMap(fc => fc?.valueChanges.pipe(startWith(fc.value)) ?? of([null])),
    map(value => value as KustoDataActivityOptions),
  );

  /** Sets the attached form control. Used for populating some values. */
  @Input() public set attachedToFormControl(value: FormControl) {
    this.attachedToFormControl$.next(value);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public static defaults: KustoRestateOMaticDataActivityOptions = {
    name: '',
    database: 'T10Analytics',
    query: KustoFunctionComponent.defaults,
    dateRange: {
      start: RestateOMaticComponent.UTC_NOW,
      end: RestateOMaticComponent.UTC_NOW.plus({ days: 7 }),
    },
    maximumExecutionTimeInMinutes: 1440,
    executionIntervalInMinutes: 1440,
    executionDelayInMinutes: 2880,
    dependencyNames: [],
    parallelismLimit: 2,
    includeChildren: true,
    creationBehavior: DataActivityCreationBehavior.Full,
    fromApi: false,
  };

  public formControls = {
    name: new FormControl({ value: RestateOMaticComponent.defaults.name, disabled: true }, [
      Validators.required,
      StringValidators.trim,
      StringValidators.uniqueInList(() => this.activePipeline.activityNames),
    ]),
    database: new FormControl(RestateOMaticComponent.defaults.database, [
      Validators.required,
      StringValidators.trim,
    ]),
    query: new FormControl(RestateOMaticComponent.defaults.query, [Validators.required]),
    dateRange: new FormControl(RestateOMaticComponent.defaults.dateRange),
    maximumExecutionTimeInMinutes: new FormControl(
      RestateOMaticComponent.defaults.maximumExecutionTimeInMinutes,
      [Validators.required, Validators.min(60), Validators.max(1440)],
    ),
    executionIntervalInMinutes: new FormControl(
      RestateOMaticComponent.defaults.executionIntervalInMinutes,
      [Validators.required],
    ),
    executionDelayInMinutes: new FormControl(
      RestateOMaticComponent.defaults.executionDelayInMinutes,
      [Validators.required],
    ),
    parallelismLimit: new FormControl(RestateOMaticComponent.defaults.parallelismLimit, [
      Validators.required,
      Validators.min(1),
      Validators.max(25),
    ]),
    dependencyNames: new FormControl(RestateOMaticComponent.defaults.dependencyNames),
    includeChildren: new FormControl(RestateOMaticComponent.defaults.includeChildren),
    creationBehavior: new FormControl(RestateOMaticComponent.defaults.creationBehavior),
    fromApi: new FormControl(RestateOMaticComponent.defaults.fromApi),
  };

  public formGroup = new FormGroup({
    name: this.formControls.name,
    database: this.formControls.database,
    query: this.formControls.query,
    dateRange: this.formControls.dateRange,
    maximumExecutionTimeInMinutes: this.formControls.maximumExecutionTimeInMinutes,
    executionIntervalInMinutes: this.formControls.executionIntervalInMinutes,
    executionDelayInMinutes: this.formControls.executionDelayInMinutes,
    parallelismLimit: this.formControls.parallelismLimit,
    dependencyNames: this.formControls.dependencyNames,
    includeChildren: this.formControls.includeChildren,
    creationBehavior: this.formControls.creationBehavior,
    fromApi: this.formControls.fromApi,
  });

  constructor(private readonly activePipeline: ActivePipelineService) {
    super();

    // pipe value changes to the parent form
    this.formGroup.valueChanges
      .pipe(
        takeUntil(this.onDestroy$),
        map(_ => this.formGroup.getRawValue()), // we need to map this to the raw value to include the disabled form controls
      )
      .subscribe(data => this.changeFn(data));

    // cleanup
    this.onDestroy$.subscribe(() => this.attachedToFormControl$.complete());
  }

  /** Gets the value of the attached form control. */
  public get attachedFormControlValue(): KustoDataActivityOptions {
    return this.attachedToFormControl?.value;
  }

  /** Angular lifecycle hook. */
  public ngAfterViewInit(): void {
    // update static values on our
    this.attachedToFormControlValue$.subscribe(v => {
      this.formControls.name.setValue(`${RestateOMaticComponent.NAME_PREFIX}${v.name}`);
    });
  }

  /** Form control hook. */
  public writeValue(data: { [key: string]: unknown }): void {
    if (data) {
      this.formGroup.patchValue(data, { emitEvent: false });

      if (data.fromApi) {
        this.formControls.dateRange.disable();
        this.formControls.creationBehavior.disable();
      } else {
        this.formControls.dateRange.enable();
        this.formControls.creationBehavior.enable();
      }
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: KustoRestateOMaticDataActivityOptions) => void): void {
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

  private changeFn = (_data: KustoRestateOMaticDataActivityOptions) => {
    /* Empty */
  };
}
