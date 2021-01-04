import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { NEVER, Observable } from 'rxjs';
import * as moment from 'moment';
import { VerifyActionButtonComponent } from '@components/verify-action-button/verify-action-button.component';

export enum BanOptions {
  AllFeatures = 'all',
  UserGeneratedContent = 'ugc',
  Matchmaking = 'matchmaking',
}

/** The ban-options panel. */
@Component({
  selector: 'ban-options',
  templateUrl: './ban-options.component.html',
  styleUrls: ['./ban-options.component.scss']
})
export class BanOptionsComponent implements OnInit {
  @ViewChild('submitButton') public submitButton: VerifyActionButtonComponent;

  public data = {
    banArea: BanOptions.AllFeatures,
    banReason: '',
    banDuration: moment.duration(10_000, 'days'),
    checkboxes: {
      banAllXboxes: false,
      banAllPCs: false,
      deleteLeaderboardEntries: false,
    }
  }

  public options = {
    banArea: BanOptions,
  }

  public canSubmit = false;
  public canSubmitDisabledReason = 'N/A';

  constructor() { }

  /** Init hook. */
  public ngOnInit(): void {
    this.onChange();
  }

  /** Called when any child form changes. */
  public onChange(): void {
    this.submitButton?.reset();

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
  }

  /** Called on submit. */
  public submitAction(): Observable<void> {
    return NEVER;
  }
}
