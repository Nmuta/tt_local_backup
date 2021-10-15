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
import { collectErrors } from '@helpers/form-group-collect-errors';
import { ActivePipelineService } from '@shared/pages/obligation/services/active-pipeline.service';
import { cloneDeep } from 'lodash';
import {
  KustoDataActivityComponent,
  KustoDataActivityOptions,
} from '../kusto-data-activity/kusto-data-activity.component';
import {
  KustoRestateOMaticDataActivityOptions,
  RestateOMaticComponent,
} from '../restate-o-matic/restate-o-matic.component';

/** A bundle of kusto-data activities related to a single parent data activity. */
export interface KustoDataActivityBundle {
  dataActivity: KustoDataActivityOptions;
  restateOMatic: KustoRestateOMaticDataActivityOptions;
}

/** A component for editing a bundle of kusto-data activities. */
@Component({
  selector: 'kusto-data-activity-bundle',
  templateUrl: './bundle.component.html',
  styleUrls: ['./bundle.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BundleComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BundleComponent),
      multi: true,
    },
  ],
})
export class BundleComponent implements ControlValueAccessor, Validator {
  public static readonly defaults: KustoDataActivityBundle = {
    dataActivity: cloneDeep(KustoDataActivityComponent.defaults),
    restateOMatic: null,
  };

  public formControls = {
    dataActivity: new FormControl(cloneDeep(BundleComponent.defaults.dataActivity), [
      Validators.required,
    ]),
    restateOMatic: new FormControl(cloneDeep(BundleComponent.defaults.restateOMatic)),
  };

  public formGroup = new FormGroup({
    dataActivity: this.formControls.dataActivity,
    restateOMatic: this.formControls.restateOMatic,
  });

  public selectedIndex: number = 0;

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

  /** Add the restate-o-matic options. */
  public addRestateOMatic(): void {
    this.formControls.restateOMatic.setValue(cloneDeep(RestateOMaticComponent.defaults));
    this.selectedIndex = 1;
  }

  /** Removes the restate-o-matic options. */
  public removeRestateOMatic(): void {
    this.formControls.restateOMatic.setValue(undefined);
    this.selectedIndex = 0;
  }

  private changeFn = (_data: KustoDataActivityOptions) => {
    /* Empty */
  };
}
