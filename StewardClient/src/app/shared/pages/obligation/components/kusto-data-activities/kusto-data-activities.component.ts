import { forwardRef } from '@angular/core';
import { Component } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { cloneDeep } from 'lodash';
import { Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ActivePipelineService } from '../../services/active-pipeline.service';
import { BundleComponent, KustoDataActivityBundle } from './bundle/bundle.component';

export type KustoDataActivityBundles = KustoDataActivityBundle[];

/** A form component for creating a variable number of KustoDataActivities. */
@Component({
  selector: 'kusto-data-activities',
  templateUrl: './kusto-data-activities.component.html',
  styleUrls: ['./kusto-data-activities.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KustoDataActivitiesComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => KustoDataActivitiesComponent),
      multi: true,
    },
  ],
})
export class KustoDataActivitiesComponent
  extends BaseComponent
  implements ControlValueAccessor, Validator
{
  public static readonly defaults: KustoDataActivityBundles = [cloneDeep(BundleComponent.defaults)];

  public formControls = [];

  public formArray = new FormArray([]);

  // NOTE: This is just a container object becuase FormArray must be contained within one.
  // NOTE: Normally, this would be used for the output type output of this would be the output type,
  // NOTE: but in this case, the output type is the FormArray contents.
  public hiddenFormGroup = new FormGroup({
    activities: this.formArray,
  });

  private readonly onChange$ = new Subject<KustoDataActivityBundles>();
  private readonly formArray$ = new Subject<FormArray>();

  constructor(private readonly activePipeline: ActivePipelineService) {
    super();

    // subscribe form callback to onChange$
    this.onChange$.pipe(takeUntil(this.onDestroy$)).subscribe(v => this.changeFn(v));

    // subscribe onChange$ to latest formArray clone's value
    this.formArray$
      .pipe(
        switchMap(formArray => formArray.valueChanges),
        startWith(this.formArray.value),
        map(value => value as KustoDataActivityBundles),
        takeUntil(this.onDestroy$),
      )
      .subscribe(this.onChange$);

    this.overrideList(KustoDataActivitiesComponent.defaults);
  }

  /** Form control hook. */
  public writeValue(data: KustoDataActivityBundles): void {
    if (data) {
      if (data.length !== this.formArray.length) {
        // if the list actually changed, we need to recreate the array
        this.overrideList(data);
      } else {
        // otherwise we can just patch the existing array
        this.formArray.patchValue(data, { emitEvent: false });
      }
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: KustoDataActivityBundles) => void): void {
    this.changeFn = fn;
    this.changeFn(this.formArray.value);
  }

  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formArray.disable();
    } else {
      this.formArray.enable();
    }
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null {
    if (this.formArray.invalid) {
      return collectErrors(this.formArray);
    }

    return null;
  }

  /** Called when the "delete" button is clicked. */
  public removeActivity(index: number): void {
    this.formArray.removeAt(index);
  }

  /** Called when the "add" button is clicked. */
  public addActivity(): void {
    this.formArray.push(
      this.valueToFormControl(cloneDeep(KustoDataActivitiesComponent.defaults[0])),
    );
  }

  /** Gets a typed value from a form control. */
  public getFormValue(formControl: FormControl): KustoDataActivityBundle {
    return formControl.value as KustoDataActivityBundle;
  }

  /** Overrides the list when a new list is created. */
  private overrideList(options: KustoDataActivityBundles): void {
    this.formControls = options.map(v => this.valueToFormControl(v));
    this.formArray = new FormArray(this.formControls, Validators.minLength(1));
    this.hiddenFormGroup = new FormGroup({ activities: this.formArray });
    this.formArray$.next(this.formArray);
  }

  /** Hook for adding standardized validators to each form control. */
  private valueToFormControl(v: KustoDataActivityBundle): FormControl {
    return new FormControl(v);
  }

  private changeFn = (_data: KustoDataActivityBundles) => {
    /* Empty */
  };
}
