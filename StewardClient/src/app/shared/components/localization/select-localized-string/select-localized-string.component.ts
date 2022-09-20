import { Component, forwardRef, Input, OnInit } from '@angular/core';
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

/** Displays the value sent on `input` as a json blob. */
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
  @Input() service: SelectLocalizedStringContract;

  public localizedStringLookup: LocalizedStringsMap = new Map();
  public localizedStringDetails: LocalizationOptions[] = [];

  public selectedLocalizedStringCollection: LocalizedString[] = [];
  public displayLanguageChips: boolean = false;
  public selectedLanguageLocalizedString: LocalizedString = null;

  public formControls = {
    selectedLocalizedStringInfo: new FormControl({}, [Validators.required]),
  };

  public formGroup = new FormGroup(this.formControls);

  public getMonitor = new ActionMonitor('GET localized strings');
  public readonly messageMaxLength: number = 512;

  private readonly getLocalizedStrings$ = new Subject<void>();

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.getLocalizedStrings$
      .pipe(
        tap(() => (this.getMonitor = this.getMonitor.repeat())),
        switchMap(() => {
          this.localizedStringLookup = new Map();
          this.formControls.selectedLocalizedStringInfo.setValue(null);
          this.selectedLocalizedStringCollection = [];
          this.displayLanguageChips = false;
          return this.service.getLocalizedStrings$().pipe(
            this.getMonitor.monitorSingleFire(),
            catchError(() => {
              this.localizedStringLookup = new Map();
              this.formControls.selectedLocalizedStringInfo.setValue(null);
              this.selectedLocalizedStringCollection = [];
              this.displayLanguageChips = false;
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
            (record: LocalizedString) => record.languageCode.toLowerCase() === SupportedLocalizationLanguageCodes.en_US.toLowerCase(),
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
        this.selectedLocalizedStringCollection = orderBy(chipList, x => !x.translated);
        this.displayLanguageChips = true;   
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
        x => !x.translated,
      );
      this.displayLanguageChips = true;
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
  public setDisabledState?(_isDisabled: boolean): void {
    /** empty */
  }

  /** Handles selection change event for language chip list */
  public onLanguageChipSelect(change: MatChipListChange): void {
    if (change.value) {
      this.selectedLanguageLocalizedString = this.selectedLocalizedStringCollection.find(
        localizedString => localizedString.languageCode == change.value.languageCode,
      );
      this.displayLanguageChips = true;   
    } else {
      this.selectedLanguageLocalizedString = null;
    }
  }
}
