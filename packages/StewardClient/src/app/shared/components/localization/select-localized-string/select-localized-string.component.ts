import { Component, forwardRef, Host, Input, OnInit, Optional, SkipSelf } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  UntypedFormControl,
  UntypedFormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { MatChipListChange } from '@angular/material/chips';
import { BaseComponent } from '@components/base-component/base.component';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { GameTitle, SupportedLocalizationLanguageCodes } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { LocalizedString, LocalizedStringsMap } from '@models/localization';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { orderBy } from 'lodash';
import { EMPTY, Observable, Subject } from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
  takeUntil,
  tap,
  pairwise,
  startWith,
} from 'rxjs/operators';

export interface SelectLocalizedStringContract {
  gameTitle: GameTitle;
  getLocalizedStrings$(): Observable<LocalizedStringsMap>;
}

/** Outputted form value of the select-localized-string component. */
export interface LocalizationOptions {
  englishText: string;
  id: GuidLikeString;
}

/** Lookup and display localized strings for selection. */
@Component({
  selector: 'select-localized-string',
  templateUrl: './select-localized-string.component.html',
  styleUrls: ['./select-localized-string.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectLocalizedStringComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SelectLocalizedStringComponent),
      multi: true,
    },
  ],
})
export class SelectLocalizedStringComponent
  extends BaseComponent
  implements OnInit, ControlValueAccessor, Validator
{
  /** formControl name of parent form. Used to get the parent validator of the field. */
  @Input() formControlName: string;

  /** The contract used to lookup and display localized strings. */
  @Input() service: SelectLocalizedStringContract;
  /** The dropdown mat label. */
  @Input() label: string = 'Select localized message';
  /** The dropdown mat hint label. (Optional) */
  @Input() hintMessage: string;
  /** Determines if the language preview display should never show. */
  @Input() disableLanguagePreview: boolean = false;

  public localizedStringLookup: LocalizedStringsMap = new Map();
  public localizedStringDetails: LocalizationOptions[] = [];

  public selectedLocalizedStringCollection: LocalizedString[] = [];
  public selectedLanguageLocalizedString: LocalizedString = null;

  public isRequired = false;

  public formControls = {
    selectedLocalizedStringInfo: new UntypedFormControl(undefined),
  };

  public formGroup = new UntypedFormGroup(this.formControls);

  public getMonitor = new ActionMonitor('GET localized strings');
  public readonly messageMaxLength: number = 512;

  private readonly getLocalizedStrings$ = new Subject<void>();

  constructor(@Optional() @Host() @SkipSelf() private controlContainer: ControlContainer) {
    super();
  }

  /** Lifecycle hook */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service defined for Select Localized String component.');
    }

    // Get the validators from the parent formControl and add them to this component validators
    const parentControl = this.controlContainer?.control.get(this.formControlName);
    this.formControls.selectedLocalizedStringInfo.setValidators(parentControl?.validator);

    // isRequired will set the [required] property of the mat-select in the UI
    // By default, the [required] property will use hasValidator(Validators.required) to verify if the field is required
    // When we use setValidators(parentControl?.validator), parentControl?.validator is a ValidatorFn that wrap every validator the parent has (Required, etc...)
    // hasValidator(Validators.required) will than return false because parentControl?.validator is not Validators.required
    // Fix based on this https://github.com/angular/components/issues/2574#issuecomment-659394478
    this.isRequired = this.formControls.selectedLocalizedStringInfo.validator?.(
      {} as AbstractControl,
    )?.required;

    this.getLocalizedStrings$
      .pipe(
        tap(() => (this.getMonitor = this.getMonitor.repeat())),
        switchMap(() => {
          this.localizedStringLookup = new Map();
          this.formControls.selectedLocalizedStringInfo.setValue(null);
          this.selectedLocalizedStringCollection = [];
          return this.service.getLocalizedStrings$().pipe(
            this.getMonitor.monitorSingleFire(),
            catchError(() => {
              this.localizedStringLookup = new Map();
              this.formControls.selectedLocalizedStringInfo.setValue(null);
              this.selectedLocalizedStringCollection = [];
              return EMPTY;
            }),
          );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(returnedLocalizedStrings => {
        this.localizedStringLookup = returnedLocalizedStrings;
        const keys = Object.keys(this.localizedStringLookup);
        this.localizedStringDetails = keys.map(x => {
          const record = this.localizedStringLookup[x].find(
            (record: LocalizedString) =>
              record.languageCode.toLowerCase() ===
              SupportedLocalizationLanguageCodes.en_US.toLowerCase(),
          );
          return {
            id: x,
            englishText: record.message,
          };
        });
        this.formControls.selectedLocalizedStringInfo.updateValueAndValidity();
      });

    this.getLocalizedStrings$.next();

    this.formControls.selectedLocalizedStringInfo.valueChanges
      .pipe(
        filter(() => !!this.formControls.selectedLocalizedStringInfo.value?.id),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        const chipList =
          this.localizedStringLookup[this.formControls.selectedLocalizedStringInfo.value?.id];
        this.selectedLocalizedStringCollection = orderBy(chipList, x => !x.isTranslated);
        this.selectedLanguageLocalizedString = null;
      });
  }

  /** Used by selector to display correct option by ID. */
  public comparisonFunction(x, y): boolean {
    return x?.id === y?.id;
  }

  /** Form control hook. */
  public writeValue(data: LocalizationOptions): void {
    if (!!data?.id) {
      this.formControls.selectedLocalizedStringInfo.patchValue(data, { emitEvent: false });
      this.selectedLocalizedStringCollection = orderBy(
        this.localizedStringLookup[this.formControls.selectedLocalizedStringInfo.value.id],
        x => !x.isTranslated,
      );
    } else {
      // This is done to be able to reset/empty the dropdown
      // If null or {} or {id:null} is passed it will be set to null
      this.selectedLocalizedStringCollection = [];
      this.formControls.selectedLocalizedStringInfo.patchValue(null, { emitEvent: true });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (value: LocalizationOptions) => void): void {
    this.formGroup.valueChanges
      .pipe(
        map(x => x.selectedLocalizedStringInfo),
        startWith(null),
        pairwise(),
        filter(([prev, cur]) => {
          return prev !== cur;
        }),
        map(([_prev, cur]) => cur),
        takeUntil(this.onDestroy$),
      )
      .subscribe(fn);
    // Call it once to force validation
    fn(this.formControls.selectedLocalizedStringInfo.value);
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null {
    if (this.formGroup.invalid) {
      return collectErrors(this.formGroup);
    }

    return null;
  }

  /** Form control hook. */
  public registerOnTouched(_fn: LocalizationOptions): void {
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

  /** Handles selection change event for language chip list */
  public onLanguageChipSelect(change: MatChipListChange): void {
    if (change.value) {
      this.selectedLanguageLocalizedString = this.selectedLocalizedStringCollection.find(
        localizedString => localizedString.languageCode == change.value.languageCode,
      );
    } else {
      this.selectedLanguageLocalizedString = null;
    }
  }
}
