import { Component, forwardRef, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { isEqual, keys } from 'lodash';
import { Subject } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { renderDelay } from '@helpers/rxjs';
import { CreditUpdateColumn, SortDirection } from '@views/credit-history/credit-history.base.component';

/** Outputted form value of the UGC search filters. */
export interface CreditUpdateSortOptionsFormValue {
  direction: SortDirection;
  column: CreditUpdateColumn;
}

/** Internal form value of the UGC search filters. */
interface CreditUpdateSortOptionsFormValueInternal {
  options: CreditUpdateSortOptionsFormValue;
}

/** A component for UGC search filters. */
@Component({
  selector: 'credit-update-sort-options',
  templateUrl: 'credit-update-sort-options.component.html',
  styleUrls: ['credit-update-sort-options.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CreditUpdateSortOptionsComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CreditUpdateSortOptionsComponent),
      multi: true,
    },
  ],
})
export class CreditUpdateSortOptionsComponent
  extends BaseComponent
  implements OnInit, ControlValueAccessor
{
  /** REVIEW-COMMENT: The UGC search filter service. */
  public columnOrderOptions = keys(CreditUpdateColumn) as CreditUpdateColumn[];
  public directionOptions = SortDirection;

  public formControls = {
    direction: new FormControl(SortDirection.Ascending, Validators.required),
    column: new FormControl(CreditUpdateColumn.Timestamp, Validators.required),
  };

  /** UGC filters form group. */
  public formGroup: FormGroup = new FormGroup(this.formControls);

  private readonly onChanges$ = new Subject<CreditUpdateSortOptionsFormValue>();

  constructor() {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    let lastValueStringified: {
      direction: string;
      column: string;
    } = null;

    this.onChanges$
      .pipe(
        tap(value => {
          // update our values before waiting for the view to update
          this.onChangeFn(value);
        }),
        renderDelay(),
      )
      .subscribe(value => {
        const valueStringified = this.stringifyFormValue(value);
        const hasChanges = !isEqual(valueStringified, lastValueStringified);

        // when there are changes and the values do not match, revalidate everything
        if (hasChanges) {
          this.formControls.direction.updateValueAndValidity();
          this.formControls.column.updateValueAndValidity();
        }

        // prep for next iteration
        lastValueStringified = valueStringified;
      });

    // when anything in the form group changes, trigger a change event
    this.formGroup.valueChanges
      .pipe(
        startWith({ initial: true, ...this.formGroup.value }), // start with the initial value, so pairwise will work on every new value
      )
      .subscribe(() => {
        const parameters = {
          direction: this.formControls.direction.value,
          column: this.formControls.column.value,
        } as CreditUpdateSortOptionsFormValue; //Make new form value type for this.

        this.onChanges$.next(parameters);
      });
  }

  /** Form control hook. */
  public writeValue(data: CreditUpdateSortOptionsFormValue): void {
    if (data) {
      const dataInternal: CreditUpdateSortOptionsFormValueInternal = {
        options: {
          direction: data.direction,
          column: data.column,
        },
      };

      this.formGroup.patchValue(dataInternal, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: CreditUpdateSortOptionsFormValue) => void): void {
    this.onChangeFn = fn;

    const parameters = {
      direction: this.formControls.direction.value,
      column: this.formControls.column.value,
    } as CreditUpdateSortOptionsFormValue;

    this.onChanges$.next(parameters);
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null {
    if (this.formGroup.invalid) {
      return collectErrors(this.formGroup);
    }

    return null;
  }

  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  private onChangeFn = (_data: CreditUpdateSortOptionsFormValue) => {
    /* empty */
  };

  /** Stringify datetime range. */
  private stringifyFormValue(rawData: CreditUpdateSortOptionsFormValue): {
    direction: string;
    column: string;
  } {
    return {
      direction: rawData?.direction?.toString(),
      column: rawData?.column?.toString()
    };
  }
}
