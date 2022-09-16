import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { MatChipListChange } from '@angular/material/chips';
import { BaseComponent } from '@components/base-component/base.component';
import { collectErrors } from '@helpers/form-group-collect-errors';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { LocalizedString, LocalizedStringCollection } from '@models/localization';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { orderBy } from 'lodash';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, filter, map, switchMap, takeUntil, tap, pairwise, startWith, } from 'rxjs/operators';

/** Outputted form value of the datetime picker. */
export type SelectLocalizedStringFormValue = string;

export interface SelectLocalizedStringContract {
  gameTitle: GameTitle;
  getLocalizedStrings$(): Observable<LocalizedStringCollection>;
}

export interface LocalizationOptions {
  text: string;
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
export class SelectLocalizedStringComponent extends BaseComponent implements OnInit, ControlValueAccessor, Validator{
  @Input() service: SelectLocalizedStringContract

  public localizedStrings: LocalizedStringCollection = {};
  public localizedStringDetails: LocalizationOptions[] = [];

  public selectedLocalizedStringCollection: LocalizedString[] = [];
  public selectedLanguageLocalizedString: LocalizedString = null;

  public formControls = {
    selectedLocalizedStringId: new FormControl('', [Validators.required]),
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
        this.formControls.selectedLocalizedStringId.setValue(null);
        this.selectedLocalizedStringCollection = [];
        return this.service.getLocalizedStrings$().pipe(
          this.getMonitor.monitorSingleFire(),
          catchError(() => {
            this.localizedStrings = {};
            this.formControls.selectedLocalizedStringId.setValue(null);
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
        const record = this.localizedStrings[x].find((record: LocalizedString)  => record.languageCode === 'en-US') //TODO invariant comparsion
        return {
          id: x,
          text: record.message,
        }
      });
      this.formControls.selectedLocalizedStringId.updateValueAndValidity();
    });

    this.getLocalizedStrings$.next();

    this.formControls.selectedLocalizedStringId.valueChanges.subscribe(() => {
      const chipList = this.localizedStrings[this.formControls.selectedLocalizedStringId.value];
      this.selectedLocalizedStringCollection = orderBy(chipList, x => !x.translated);
    })
  }


  /** Handles selection change event for language chip list */
  public onLanguageChipSelect(change: MatChipListChange): void {
    if (change.value) {
      this.selectedLanguageLocalizedString = this.selectedLocalizedStringCollection.find(localizedString => localizedString.languageCode == change.value.languageCode);
    }
    else {
      this.selectedLanguageLocalizedString = null;
    }
  }

  /** Form control hook. */
  public writeValue(data: SelectLocalizedStringFormValue): void {
    this.formControls.selectedLocalizedStringId.patchValue(data, { emitEvent: false });
    this.selectedLocalizedStringCollection = orderBy(this.localizedStrings[this.formControls.selectedLocalizedStringId.value], x => !x.translated)    
  }

  /** Form control hook. */
  public registerOnChange(fn: (value: SelectLocalizedStringFormValue) => void): void {
    this.formGroup.valueChanges.pipe(
      map(x => x.selectedLocalizedStringId),
      startWith(null),
      pairwise(),
      filter(([prev, cur]) => {
        return prev !== cur;
      }),
      map(([_prev, cur]) => cur),
    ).subscribe(fn);
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null {
    if (this.formGroup.invalid) {
      return collectErrors(this.formGroup);
    }

    return null;
  }

  /** Form control hook. */
  public registerOnTouched(_fn: any): void {
    /** empty */
  }

  /** Form control hook. */
  public setDisabledState?(_isDisabled: boolean): void {
    /** empty */
  }
}