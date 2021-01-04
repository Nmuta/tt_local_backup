import { Component, forwardRef, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AbstractControl, ControlValueAccessor, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';

export enum BanArea {
  AllFeatures = 'all',
  UserGeneratedContent = 'ugc',
  Matchmaking = 'matchmaking',
}

export interface BanOptions {
  banArea: BanArea,
  banReason: string,
  banDuration: moment.Duration,
  checkboxes: {
    banAllXboxes: boolean,
    banAllPCs: boolean,
    deleteLeaderboardEntries: boolean,
  },
};

/** The ban-options panel. */
@Component({
  selector: 'ban-options',
  templateUrl: './ban-options.component.html',
  styleUrls: ['./ban-options.component.scss'],
  providers: [
       {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BanOptionsComponent),
      multi: true
    },
     {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BanOptionsComponent),
      multi: true
    }
  ]
})
export class BanOptionsComponent implements OnInit, ControlValueAccessor, Validator {
  public defaults: BanOptions = {
    banArea: BanArea.AllFeatures,
    banReason: '',
    banDuration: null,
    checkboxes: {
      banAllXboxes: false,
      banAllPCs: false,
      deleteLeaderboardEntries: false,
    }
  }

  public formControls = {
    banArea: new FormControl(this.defaults.banArea, [Validators.required]),
    banReason: new FormControl(this.defaults.banReason, [Validators.required]),
    banDuration: new FormControl(this.defaults.banDuration, [Validators.required]),
    checkboxes: {
      banAllXboxes: new FormControl(this.defaults.checkboxes.banAllXboxes),
      banAllPCs: new FormControl(this.defaults.checkboxes.banAllPCs),
      deleteLeaderboardEntries: new FormControl(this.defaults.checkboxes.deleteLeaderboardEntries),
    },
  };
  
  public formGroup = new FormGroup({
    banArea: this.formControls.banArea,
    banReason: this.formControls.banReason,
    banDuration: this.formControls.banDuration,
    checkboxes: new FormGroup({
      banAllXboxes: this.formControls.checkboxes.banAllXboxes,
      banAllPCs: this.formControls.checkboxes.banAllPCs,
      deleteLeaderboardEntries: this.formControls.checkboxes.deleteLeaderboardEntries,
    }),
  });

  public options = {
    banArea: BanArea,
  }

  public canSubmit = false;
  public canSubmitDisabledReason = 'N/A';

  /** Form control hook. */
  public writeValue(data: { [key: string]: unknown }): void {
    if (data) {
      this.formGroup.setValue(data, { emitEvent: false });
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: BanOptions) => void): void {
    this.formGroup.valueChanges.subscribe(fn)
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

  /** Init hook. */
  public ngOnInit(): void {
    this.onChange();
  }

  /** Called when any child form changes. */
  public onChange(): void {
    // TODO: This is silly. Surely there's some built in way to handle this better.
    // TODO: It looks like FormControl can handle this but it's not clear how well that plays with angular material in the general case.
    // TODO: Actually it looks like half the things from Angular Material implement FormControl.
    // https://medium.com/angular-in-depth/angular-nested-reactive-forms-using-cvas-b394ba2e5d0d
    // https://indepth.dev/posts/1055/never-again-be-confused-when-implementing-controlvalueaccessor-in-angular-forms
    if (!this.defaults.banArea) {
      this.canSubmit = false;
      this.canSubmitDisabledReason = 'Missing ban area';
    } else if (!this.defaults.banDuration) {
      this.canSubmit = false;
      this.canSubmitDisabledReason = 'Missing ban duration';
    } else if (this.defaults.banReason.trim().length <= 0) {
      this.canSubmit = false;
      this.canSubmitDisabledReason = 'Missing ban reason';
    } else {
      this.canSubmit = true;
      this.canSubmitDisabledReason = 'N/A';
    }
  }

  /** Form control hook. */
  public validate(_: AbstractControl): ValidationErrors | null{
    if (this.formGroup.valid) {
      return null;
    }
    
    return { invalidForm: {valid: false, message: 'fields are invalid'}};
  }
}
