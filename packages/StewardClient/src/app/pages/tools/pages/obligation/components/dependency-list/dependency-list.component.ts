import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  Validator,
  UntypedFormGroup,
  UntypedFormArray,
  UntypedFormControl,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { BaseComponent } from '@components/base-component/base.component';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { StringValidators } from '@shared/validators/string-validators';
import { orderBy } from 'lodash';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ActivePipelineService } from '../../services/active-pipeline.service';

export type DependencyListOptions = string[];

/** A form component for creating a variable number of Obligation Data Activity Dependencies. */
@Component({
  selector: 'dependency-list',
  templateUrl: './dependency-list.component.html',
  styleUrls: ['./dependency-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DependencyListComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DependencyListComponent),
      multi: true,
    },
  ],
})
export class DependencyListComponent
  extends BaseComponent
  implements ControlValueAccessor, Validator
{
  public static readonly defaults: DependencyListOptions = [];

  @ViewChild('input') private input: ElementRef<HTMLInputElement>;

  public inputFormControl = new UntypedFormControl();
  public separatorKeysCodes: number[] = [ENTER, COMMA];

  public formControls = [];

  public formArray = new UntypedFormArray([]);

  // NOTE: This is just a container object becuase FormArray must be contained within one.
  // NOTE: Normally, this would be used for the output type output of this would be the output type,
  // NOTE: but in this case, the output type is the FormArray contents.
  public formGroup = new UntypedFormGroup({
    activities: this.formArray,
  });

  /** The dependency options. */
  public dependencyOptions$: Observable<string[]>;

  private readonly onChange$ = new Subject<DependencyListOptions>();
  private readonly formArray$ = new Subject<UntypedFormArray>();

  constructor(private readonly activePipeline: ActivePipelineService) {
    super();

    // an observable of the latest permissible dependency names; used for auto-complete
    this.dependencyOptions$ = combineLatest([
      this.formArray.valueChanges.pipe(
        startWith({}),
        map(() => this.formControls.map(fc => fc.value as string)),
      ),
      this.activePipeline.activityNames$.pipe(startWith(this.activePipeline.activityNames)),
    ]).pipe(
      map(([values, activityNames]) => activityNames.filter(an => !values.includes(an))),
      map(activityNames => orderBy(activityNames)),
      takeUntil(this.onDestroy$),
    );

    // pass on updated values to the parent form
    this.onChange$.pipe(takeUntil(this.onDestroy$)).subscribe(v => this.changeFn(v));

    // subscribe onChange$ to latest formArray clone's value
    this.formArray$
      .pipe(
        switchMap(formArray => formArray.valueChanges.pipe(startWith(formArray.value))),
        map(value => value as DependencyListOptions),
        takeUntil(this.onDestroy$),
      )
      .subscribe(this.onChange$);

    this.overrideList(DependencyListComponent.defaults);
  }

  /** Fired when an autocomplete option is selected. */
  public onSelected(event: MatAutocompleteSelectedEvent): void {
    this.formArray.push(this.valueToFormControl(event.option.viewValue));
    this.input.nativeElement.value = '';
    this.inputFormControl.setValue(null);
  }

  /** Form control hook. */
  public writeValue(data: DependencyListOptions): void {
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
  public registerOnChange(fn: (data: DependencyListOptions) => void): void {
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
  public removeDependency(index: number): void {
    this.formArray.removeAt(index);
  }

  /** Called when the "add" button is clicked. */
  public addDependency(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.formArray.push(this.valueToFormControl(value.trim()));
    }

    if (input) {
      input.value = '';
    }
  }

  /** Overrides the list when a new list is created. */
  private overrideList(options: DependencyListOptions): void {
    this.formControls = options.map(v => this.valueToFormControl(v));
    this.formArray = new UntypedFormArray(this.formControls);
    this.formGroup = new UntypedFormGroup({ activities: this.formArray });
    this.formArray$.next(this.formArray);
  }

  /** Hook for adding standardized validators to each form control. */
  private valueToFormControl(v: string): UntypedFormControl {
    return new UntypedFormControl(v, [
      StringValidators.existsInList(() => this.activePipeline.activityNames),
      StringValidators.trim,
    ]);
  }

  private changeFn = (_data: DependencyListOptions) => {
    /* Empty */
  };
}
