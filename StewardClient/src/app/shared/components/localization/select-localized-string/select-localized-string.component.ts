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
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { LocalizedString, LocalizedStringCollection } from '@models/localization';
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

/** Outputted form value of the datetime picker. */
export type SelectLocalizedStringFormValue = LocalizationOptions;

export interface SelectLocalizedStringContract {
  gameTitle: GameTitle;
  getLocalizedStrings$(): Observable<LocalizedStringCollection>;
}

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

  public localizedStrings: LocalizedStringCollection = {};
  public localizedStringDetails: LocalizationOptions[] = [];

  public selectedLocalizedStringCollection: LocalizedString[] = [];
  public selectedLanguageLocalizedString: LocalizedString = null;

  public formControls = {
    selectedLocalizedStringInfo: new FormControl({}, [Validators.required]),
  };

  public formGroup = new FormGroup(this.formControls); //todo: validate not empty

  public getMonitor = new ActionMonitor('GET localized strings');
  public readonly messageMaxLength: number = 512;

  private readonly getLocalizedStrings$ = new Subject<void>();

  /** Lifecycle hook */
  public ngOnInit(): void {
    this.getLocalizedStrings$
      .pipe(
        tap(() => (this.getMonitor = this.getMonitor.repeat())),
        switchMap(() => {
          this.localizedStrings = {};
          this.formControls.selectedLocalizedStringInfo.setValue(null);
          this.selectedLocalizedStringCollection = [];
          return this.service.getLocalizedStrings$().pipe(
            this.getMonitor.monitorSingleFire(),
            catchError(() => {
              this.localizedStrings = {};
              this.formControls.selectedLocalizedStringInfo.setValue(null);
              this.selectedLocalizedStringCollection = [];
              return EMPTY;
            }),
          );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(returnedLocalizedStrings => {
        this.localizedStrings = returnedLocalizedStrings;
        const keys = Object.keys(this.localizedStrings);
        this.localizedStringDetails = keys.map(x => {
          const record = this.localizedStrings[x].find(
            (record: LocalizedString) => record.languageCode === 'en-US',
          ); //TODO invariant comparsion
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
          this.localizedStrings[this.formControls.selectedLocalizedStringInfo.value?.id];
        this.selectedLocalizedStringCollection = orderBy(chipList, x => !x.translated);
        this.selectedLanguageLocalizedString = null;
      });
  }

  /** Used by selector to display correct option by ID. */
  public comparisonFunction(x, y): boolean {
    return x?.id === y?.id;
  }

  /** Form control hook. */
  public writeValue(data: SelectLocalizedStringFormValue): void {
    if (!!data?.id) {
      this.formControls.selectedLocalizedStringInfo.patchValue(data, { emitEvent: false });
      this.selectedLocalizedStringCollection = orderBy(
        this.localizedStrings[this.formControls.selectedLocalizedStringInfo.value.id],
        x => !x.translated,
      );
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (value: SelectLocalizedStringFormValue) => void): void {
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
  public registerOnTouched(_fn: SelectLocalizedStringFormValue): void {
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
    } else {
      this.selectedLanguageLocalizedString = null;
    }
  }
}
