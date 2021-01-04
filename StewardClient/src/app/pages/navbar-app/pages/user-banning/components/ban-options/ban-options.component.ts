import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import * as moment from 'moment';
import { VerifyActionButtonComponent } from '@components/verify-action-button/verify-action-button.component';
import { ControlValueAccessor, FormControl, FormGroup, Validators } from '@angular/forms';

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
  styleUrls: ['./ban-options.component.scss']
})
export class BanOptionsComponent implements OnInit, ControlValueAccessor {
  public data: BanOptions = {
    banArea: BanArea.AllFeatures,
    banReason: '',
    banDuration: moment.duration(10_000, 'days'),
    checkboxes: {
      banAllXboxes: false,
      banAllPCs: false,
      deleteLeaderboardEntries: false,
    }
  }

  public options = {
    banArea: BanArea,
  }

  public canSubmit = false;
  public canSubmitDisabledReason = 'N/A';

  public onChangeFunction: (data: BanOptions) => void = () => { /** empty */ };

  constructor() { }

  /** Form control hook. */
  public writeValue(data: BanOptions): void {
    this.data = data;
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: BanOptions) => void): void {
    this.onChangeFunction = fn;
  }
  
  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  public setDisabledState?(_isDisabled: boolean): void {
    /** empty */
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
    if (!this.data.banArea) {
      this.canSubmit = false;
      this.canSubmitDisabledReason = 'Missing ban area';
    } else if (!this.data.banDuration) {
      this.canSubmit = false;
      this.canSubmitDisabledReason = 'Missing ban duration';
    } else if (this.data.banReason.trim().length <= 0) {
      this.canSubmit = false;
      this.canSubmitDisabledReason = 'Missing ban reason';
    } else {
      this.canSubmit = true;
      this.canSubmitDisabledReason = 'N/A';
    }

    this.onChangeFunction(this.data);
  }

  /** Called on submit. */
  public submitAction(): Observable<void> {
    return NEVER;
  }
}
