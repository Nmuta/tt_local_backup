import { Component, forwardRef, Input, OnInit } from '@angular/core';
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
import { GameTitleCodeName } from '@models/enums';
import { UgcSearchFilters, UgcType } from '@models/ugc-filters';
import { DetailedCar } from '@models/detailed-car';
import BigNumber from 'bignumber.js';
import { isEqual, keys } from 'lodash';
import { Subject } from 'rxjs';
import { delay, startWith, tap } from 'rxjs/operators';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { MakeModelAutocompleteServiceContract } from '@views/make-model-autocomplete/make-model-autocomplete/make-model-autocomplete.component';
import { OnChanges } from '@angular/core';

/** Outputted form value of the UGC search filters. */
export type UgcSearchFiltersFormValue = UgcSearchFilters;

/** Internal form value of the UGC search filters. */
interface UgcSearchFiltersFormValueInternal {
  filters: UgcSearchFiltersFormValue;
}

/** Service contract for UGC search filters. */
export interface UgcSearchFiltersServiceContract {
  gameTitle: GameTitleCodeName;
  makeModelAutocompleteServiceContract: MakeModelAutocompleteServiceContract;
  foundFn: (identity: AugmentedCompositeIdentity) => IdentityResultAlpha | null;
  rejectionFn: (identity: AugmentedCompositeIdentity) => string | null;
}

/** A component for UGC search filters. */
@Component({
  selector: 'ugc-search-filters',
  templateUrl: 'ugc-search-filters.component.html',
  styleUrls: ['ugc-search-filters.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UgcSearchFiltersComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UgcSearchFiltersComponent),
      multi: true,
    },
  ],
})
export class UgcSearchFiltersComponent
  extends BaseComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
  public static defaults: UgcSearchFiltersFormValue = {
    xuid: null,
    ugcType: UgcType.Livery,
    carId: null,
    keywords: null,
    isFeatured: false,
  };

  @Input() public serviceContract: UgcSearchFiltersServiceContract;

  public ugcType = keys(UgcType).filter(type => type !== UgcType.Unknown) as UgcType[];

  public formControls = {
    ugcType: new FormControl(UgcType.Livery, Validators.required),
    makeModelInput: new FormControl(null),
    keywords: new FormControl(''),
    isFeatured: new FormControl(false, Validators.required),
    identity: new FormControl(null),
  };

  /** UGC filters form group. */
  public formGroup: FormGroup = new FormGroup(this.formControls);

  private readonly onChanges$ = new Subject<UgcSearchFiltersFormValue>();
  constructor() {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    if (
      !this.serviceContract.foundFn ||
      !this.serviceContract.rejectionFn ||
      !this.serviceContract.makeModelAutocompleteServiceContract ||
      !this.serviceContract.gameTitle
    ) {
      throw new Error('Invalid service contract.');
    }

    let lastValueStringified: {
      xuid: string;
      ugcType: string;
      carId: string;
      keywords: string;
      isFeatured: string;
    } = null;

    this.onChanges$
      .pipe(
        tap(value => {
          // update our values before waiting for the view to update
          this.onChangeFn(value);
        }),
        delay(0), // must happen *after* the view updates. this gets it in the queue
      )
      .subscribe(value => {
        const valueStringified = this.stringifyFormValue(value);
        const hasChanges = !isEqual(valueStringified, lastValueStringified);

        // when there are changes and the values do not match, revalidate everything
        if (hasChanges) {
          this.formControls.identity.updateValueAndValidity();
          this.formControls.ugcType.updateValueAndValidity();
          this.formControls.makeModelInput.updateValueAndValidity();
          this.formControls.keywords.updateValueAndValidity();
          this.formControls.isFeatured.updateValueAndValidity();
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
        const carFilter = this.formControls.makeModelInput.value as DetailedCar;
        let carId: BigNumber = undefined;

        if (!!carFilter) {
          carId = carFilter?.id;
        }

        const parameters = {
          xuid: (this.formControls.identity.value as IdentityResultAlpha)?.xuid,
          ugcType: this.formControls.ugcType.value,
          carId: carId,
          keywords: this.formControls.keywords.value,
          isFeatured: this.formControls.isFeatured.value,
        } as UgcSearchFiltersFormValue;

        this.onChanges$.next(parameters);
      });
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(): void {
    if (
      !this.serviceContract.foundFn ||
      !this.serviceContract.rejectionFn ||
      !this.serviceContract.makeModelAutocompleteServiceContract ||
      !this.serviceContract.gameTitle
    ) {
      throw new Error('Invalid service contract.');
    }
  }

  /** Form control hook. */
  public writeValue(data: UgcSearchFiltersFormValue): void {
    if (data) {
      const dataInternal: UgcSearchFiltersFormValueInternal = {
        filters: {
          xuid: data.xuid,
          ugcType: data.ugcType,
          carId: data.carId,
          keywords: data.keywords,
          isFeatured: data.isFeatured,
        },
      };

      this.formGroup.patchValue(dataInternal, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: UgcSearchFiltersFormValue) => void): void {
    this.onChangeFn = fn;
    const carFilter = this.formControls.makeModelInput.value as DetailedCar;
    let carId: BigNumber = undefined;

    if (!!carFilter) {
      carId = carFilter?.id;
    }

    const parameters = {
      xuid: (this.formControls.identity.value as IdentityResultAlpha)?.xuid,
      ugcType: this.formControls.ugcType.value,
      carId: carId,
      keywords: this.formControls.keywords.value,
      isFeatured: this.formControls.isFeatured.value,
    } as UgcSearchFiltersFormValue;

    this.onChanges$.next(parameters);
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null {
    if (this.formGroup.invalid) {
      return collectErrors(this.formGroup);
    }

    return null;
  }

  /** Clears the keyword input and outputs the updated search filters */
  public clearKeyword(): void {
    this.formControls.keywords.setValue(null);
  }

  /** Player identity selected */
  public playerIdentityFound(newIdentity: AugmentedCompositeIdentity): void {
    const titleSpecificIdentity = this.serviceContract.foundFn(newIdentity);

    this.formControls.identity.setValue(titleSpecificIdentity);
  }

  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  private onChangeFn = (_data: UgcSearchFiltersFormValue) => {
    /* empty */
  };

  /** Stringify datetime range. */
  private stringifyFormValue(rawData: UgcSearchFiltersFormValue): {
    xuid: string;
    ugcType: string;
    carId: string;
    keywords: string;
    isFeatured: string;
  } {
    return {
      xuid: rawData?.xuid?.toString(),
      ugcType: rawData?.ugcType?.toString(),
      carId: rawData?.carId?.toString(),
      keywords: rawData?.keywords?.toString(),
      isFeatured: rawData?.isFeatured?.toString(),
    };
  }
}
