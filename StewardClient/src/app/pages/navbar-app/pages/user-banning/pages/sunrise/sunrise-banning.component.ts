import { Component, ViewChild, ViewChildren } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { IdentityResultAlpha, IdentityResultBeta } from '@models/identity-query.model';
import { SunriseBanSummary } from '@models/sunrise';
import { SunriseService } from '@services/sunrise';
import { SunriseBanHistoryComponent } from '@shared/views/ban-history/titles/sunrise/sunrise-ban-history.component';
import { Dictionary, first, keyBy } from 'lodash';
import { map, switchMap } from 'rxjs/operators';

/** Routed Component; Sunrise Banning Tool. */
@Component({
  templateUrl: './sunrise-banning.component.html',
  styleUrls: ['./sunrise-banning.component.scss'],
})
export class SunriseBanningComponent {
  @ViewChildren('sunrise-ban-history') public banHistoryComponents: SunriseBanHistoryComponent[] = [];

  public formControls = {
    playerIdentities: new FormControl([], [Validators.required, Validators.minLength(1)]),
    banOptions: new FormControl('', [Validators.required]),
  };

  public formGroup = new FormGroup({
    banOptions: this.formControls.banOptions,
    playerIdentities: this.formControls.playerIdentities,
  });

  public summaryLookup: Dictionary<SunriseBanSummary> = {};

  constructor(private readonly sunrise: SunriseService) {
    this.formControls.playerIdentities.valueChanges
      .pipe(
        map((identities: (IdentityResultAlpha | IdentityResultBeta)[]) => identities.map(v => v.xuid)), // to xuid list
        switchMap(xuids => this.sunrise.getBanSummariesByXuids(xuids)), // make reqeusts
        map(summaries => keyBy(summaries, e => e.xuid) as Dictionary<SunriseBanSummary>)
      ).subscribe(summaryLookup => this.summaryLookup = summaryLookup);
  }

  /** Maps a xuid to a ban history component. */
  public getBanHistoryComponentByXuid(xuid: BigInt): SunriseBanHistoryComponent {
    return first(this.banHistoryComponents.filter(c => c.xuid === xuid))
  }

  /** Submit the form. */
  public submit(): void {
    // const identities = this.formControls.playerIdentities.value as IdentityResultAlphaBatch;
    // const banOptions = this.formControls.banOptions.value as BanOptions;
    // TODO
  }
}
