import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormControl,
  UntypedFormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { UgcOrderBy, UgcSearchFilters, UgcType } from '@models/ugc-filters';
import { SimpleCar } from '@models/cars';
import BigNumber from 'bignumber.js';
import { isEqual, keys } from 'lodash';
import { Subject } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { MakeModelAutocompleteServiceContract } from '@views/make-model-autocomplete/make-model-autocomplete/make-model-autocomplete.component';
import { OnChanges } from '@angular/core';
import { renderDelay } from '@helpers/rxjs';
import { SpecialIdentity } from '@models/special-identity';
import { getUserDetailsRoute } from '@helpers/route-links';

/** Outputted form value of the UGC search filters. */
export type UgcSearchFiltersFormValue = UgcSearchFilters;

/** Service contract for UGC search filters. */
export interface UgcSearchFiltersServiceContract {
  gameTitle: GameTitle;
  makeModelAutocompleteServiceContract: MakeModelAutocompleteServiceContract;
  supportedUgcTypes: UgcType[];
  specialIdentitiesAllowed: SpecialIdentity[];
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
  /** REVIEW-COMMENT: The UGC search filter service. */
  @Input() public serviceContract: UgcSearchFiltersServiceContract;

  public orderByOptions = keys(UgcOrderBy) as UgcOrderBy[];

  public formControls = {
    ugcType: new UntypedFormControl(null, Validators.required),
    makeModelInput: new UntypedFormControl(null),
    keywords: new UntypedFormControl(''),
    orderBy: new UntypedFormControl(UgcOrderBy.PopularityScoreDesc, Validators.required),
    isFeatured: new UntypedFormControl(false, Validators.required),
    identity: new UntypedFormControl(null),
  };

  public playerNotFound: boolean = false;

  public ugcDetailsRoute = null;

  /** UGC filters form group. */
  public formGroup: UntypedFormGroup = new UntypedFormGroup(this.formControls);

  private readonly onChanges$ = new Subject<UgcSearchFiltersFormValue>();

  /** Gets the supported ugc types */
  public get ugcTypes(): UgcType[] {
    return this.serviceContract.supportedUgcTypes;
  }

  constructor() {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    let lastValueStringified: {
      xuid: string;
      ugcType: string;
      carId: string;
      keywords: string;
      orderBy: string;
      isFeatured: string;
    } = null;

    this.ugcDetailsRoute = getUserDetailsRoute(this.serviceContract.gameTitle);

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
          this.formControls.identity.updateValueAndValidity();
          this.formControls.ugcType.updateValueAndValidity();
          this.formControls.makeModelInput.updateValueAndValidity();
          this.formControls.keywords.updateValueAndValidity();
          this.formControls.orderBy.updateValueAndValidity();
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
        const carFilter = this.formControls.makeModelInput.value as SimpleCar;
        let carId: BigNumber = undefined;

        if (!!carFilter) {
          carId = carFilter?.id;
        }

        const parameters = {
          xuid: (this.formControls.identity.value as IdentityResultAlpha)?.xuid,
          ugcType: this.formControls.ugcType.value,
          carId: carId,
          keywords: this.formControls.keywords.value,
          orderBy: this.formControls.orderBy.value,
          isFeatured: this.formControls.isFeatured.value,
        } as UgcSearchFiltersFormValue;

        this.onChanges$.next(parameters);
      });
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(): void {
    if (!this.serviceContract) {
      throw new Error('No service is defined for UGC search filters component.');
    }

    if (this.serviceContract.supportedUgcTypes.length <= 0) {
      throw new Error('No supported UGC types given to UGC search filters service contract.');
    }

    this.formControls.ugcType.setValue(this.serviceContract.supportedUgcTypes[0]);
  }

  /** Form control hook. */
  public writeValue(data: UgcSearchFiltersFormValue): void {
    if (data) {
      this.formGroup.patchValue(data, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: UgcSearchFiltersFormValue) => void): void {
    this.onChangeFn = fn;
    const carFilter = this.formControls.makeModelInput.value as SimpleCar;
    let carId: BigNumber = undefined;

    if (!!carFilter) {
      carId = carFilter?.id;
    }

    const parameters = {
      xuid: (this.formControls.identity.value as IdentityResultAlpha)?.xuid,
      ugcType: this.formControls.ugcType.value,
      carId: carId,
      keywords: this.formControls.keywords.value,
      orderBy: this.formControls.orderBy.value,
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

    this.playerNotFound = !!newIdentity?.result && !titleSpecificIdentity;
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
    orderBy: string;
    isFeatured: string;
  } {
    return {
      xuid: rawData?.xuid?.toString(),
      ugcType: rawData?.ugcType?.toString(),
      carId: rawData?.carId?.toString(),
      keywords: rawData?.keywords?.toString(),
      orderBy: rawData?.orderBy?.toString(),
      isFeatured: rawData?.isFeatured?.toString(),
    };
  }
}
