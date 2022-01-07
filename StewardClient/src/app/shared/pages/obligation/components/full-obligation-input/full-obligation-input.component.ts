import { Component, forwardRef, OnInit } from '@angular/core';
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
import { collectErrors } from '@helpers/form-group-collect-errors';
import { ObligationPipelinePartial } from '@models/pipelines/obligation-pipeline-partial';
import { ObligationsService } from '@services/obligations';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { StringValidators } from '@shared/validators/string-validators';
import { chain, cloneDeep } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ActivePipelineService } from '../../services/active-pipeline.service';
import {
  KustoDataActivitiesComponent,
  KustoDataActivityBundles,
} from '../kusto-data-activities/kusto-data-activities.component';
import {
  ObligationPrincipalOptions,
  ObligationPrincipalsComponent,
} from '../obligation-principals/obligation-principals.component';

export interface ObligationOptions {
  name: string;
  description: string;
  dataActivities: KustoDataActivityBundles;
  principals: ObligationPrincipalOptions[];
}

/** A form component that bundles all the validation of a full obligation item. */
@Component({
  selector: 'full-obligation-input',
  templateUrl: './full-obligation-input.component.html',
  styleUrls: ['./full-obligation-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FullObligationInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FullObligationInputComponent),
      multi: true,
    },
  ],
})
export class FullObligationInputComponent
  extends BaseComponent
  implements ControlValueAccessor, Validator, OnInit
{
  public static readonly defaults: ObligationOptions = {
    name: '',
    description: '',
    dataActivities: cloneDeep(KustoDataActivitiesComponent.defaults),
    principals: cloneDeep(ObligationPrincipalsComponent.defaultsAll),
  };

  public formControls = {
    name: new FormControl(FullObligationInputComponent.defaults.name, [
      Validators.required,
      StringValidators.trim,
    ]),
    description: new FormControl(FullObligationInputComponent.defaults.description, [
      Validators.required,
      StringValidators.trim,
    ]),
    dataActivities: new FormControl(FullObligationInputComponent.defaults.dataActivities, [
      Validators.required,
      Validators.minLength(1),
    ]),
    principals: new FormControl(FullObligationInputComponent.defaults.principals),
  };

  public formGroup = new FormGroup({
    name: this.formControls.name,
    description: this.formControls.description,
    dataActivities: this.formControls.dataActivities,
    principals: this.formControls.principals,
  });

  /** Options for the GET autocomplete. */
  public filteredOptions: Observable<ObligationPipelinePartial[]>;

  /** The options being considered for GET autocomplete. */
  public options: ObligationPipelinePartial[] = [];
  public options$ = new Subject<ObligationPipelinePartial[]>();
  public optionsMonitor = new ActionMonitor('GET api/pipeline for autocomplete');

  constructor(
    private readonly obligations: ObligationsService,
    private readonly activePipeline: ActivePipelineService,
  ) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.prepareDropdownOptions();

    // repeat the prepare dropdown step when changes might update the list
    this.activePipeline.onSync$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => this.prepareDropdownOptions());

    // filter autocomplete when the GET form value is changed or the autocomplete list changes
    this.filteredOptions = this.formControls.name.valueChanges.pipe(
      startWith(''),
      switchMap(v =>
        this.options$.pipe(
          startWith(v),
          map(_ => v),
          takeUntil(this.onDestroy$),
        ),
      ),
      map(value => this.filterAutocomplete(value)),
      takeUntil(this.onDestroy$),
    );
  }

  /** Form control hook. */
  public writeValue(data: { [key: string]: unknown }): void {
    if (data) {
      this.formGroup.setValue(data, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: ObligationOptions) => void): void {
    this.formGroup.valueChanges.subscribe(fn);
    fn(this.formGroup.value);
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

  private filterAutocomplete(value: string): ObligationPipelinePartial[] {
    const filterValue = value.toLowerCase();

    return chain(this.options)
      .filter(option => option.name.toLowerCase().includes(filterValue))
      .orderBy([option => option.name.toLowerCase().indexOf(filterValue), option => option.name])
      .value();
  }

  private prepareDropdownOptions(): void {
    this.optionsMonitor = new ActionMonitor(this.optionsMonitor.dispose().label);

    // initialize the auto-complete list asynchronously
    this.obligations
      .getAll$()
      .pipe(this.optionsMonitor.monitorSingleFire())
      .subscribe(options => {
        this.options = options;
        this.options$.next(this.options);
      });
  }
}
