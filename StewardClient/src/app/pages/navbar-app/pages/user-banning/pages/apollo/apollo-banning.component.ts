import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApolloBanRequest, ApolloBanArea } from '@models/apollo/apollo-ban-request.model';
import { ApolloBanSummary } from '@models/apollo/apollo-ban-summary.model';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { ApolloService } from '@services/apollo';
import { Dictionary, filter, keyBy } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BanOptions } from '../../components/ban-options/ban-options.component';

/** Routed Component; Apollo Banning Tool. */
@Component({
  templateUrl: './apollo-banning.component.html',
  styleUrls: ['./apollo-banning.component.scss'],
})
export class ApolloBanningComponent {
  public formControls = {
    playerIdentities: new FormControl([], [Validators.required, Validators.minLength(1)]),
    banOptions: new FormControl('', [Validators.required]),
  };

  public formGroup = new FormGroup({
    banOptions: this.formControls.banOptions,
    playerIdentities: this.formControls.playerIdentities,
  });

  public summaryLookup: Dictionary<ApolloBanSummary> = {};
  public bannedXuids: BigInt[] = [];
  public selectedPlayer: IdentityResultAlpha = null;

  constructor(private readonly apollo: ApolloService) {
    const summaries = new Subject<ApolloBanSummary[]>();
    this.formControls.playerIdentities.valueChanges
      .pipe(
        map((identities: (IdentityResultAlpha)[]) => identities.map(v => v.xuid)), // to xuid list
        switchMap(xuids => this.apollo.getBanSummariesByXuids(xuids)), // make requests
      ).subscribe(summaries);
    summaries.pipe(
      map(summaries => keyBy(summaries, e => e.xuid) as Dictionary<ApolloBanSummary>),
    ).subscribe(summaryLookup => this.summaryLookup = summaryLookup);
    summaries.pipe(
      map(summaries => filter(summaries, summary => summary.banCount > BigInt(0))), // only banned identities
      map(summaries => summaries.map(summary => summary.xuid)), // map to xuids
    ).subscribe(bannedXuids => this.bannedXuids = bannedXuids);
  }

  /** Selects a given player. */
  public selectPlayer(identity: IdentityResultAlpha): void {
    this.selectedPlayer = identity;
  }

  /** Submit the form. */
  public submit(): Observable<unknown> {
    const identities = this.formControls.playerIdentities.value as IdentityResultAlphaBatch;
    const banOptions = this.formControls.banOptions.value as BanOptions;
    const bans: ApolloBanRequest[] = identities.map(identity => {
      return <ApolloBanRequest>{
        xuid: identity.xuid,
        banAllConsoles: banOptions.checkboxes.banAllXboxes,
        banAllPcs: banOptions.checkboxes.banAllPCs,
        deleteLeaderboardEntries: banOptions.checkboxes.deleteLeaderboardEntries,
        sendReasonNotification: true,
        reason: banOptions.banReason,
        featureArea: banOptions.banArea as unknown as ApolloBanArea,
        duration: banOptions.banDuration,
      };
    });

    return this.apollo.postBanPlayers(bans);
  }
}
