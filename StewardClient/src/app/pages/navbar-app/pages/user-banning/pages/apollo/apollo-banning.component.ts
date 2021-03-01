import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApolloBanArea, ApolloBanRequest, ApolloBanSummary } from '@models/apollo';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';
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
    banOptions: new FormControl('', [Validators.required]),
  };

  public formGroup = new FormGroup({
    banOptions: this.formControls.banOptions,
  });

  public playerIdentities$ = new Subject<IdentityResultAlpha[]>();
  public playerIdentities: IdentityResultAlpha[] = [];
  public selectedPlayerIdentity: AugmentedCompositeIdentity = null;

  public summaryLookup: Dictionary<ApolloBanSummary> = {};
  public bannedXuids: bigint[] = [];
  public selectedPlayer: IdentityResultAlpha = null;

  constructor(private readonly apollo: ApolloService) {
    const summaries = new Subject<ApolloBanSummary[]>();
    this.playerIdentities$
      .pipe(
        map(identities => identities.map(i => i.xuid)), // to xuid list
        switchMap(xuids => this.apollo.getBanSummariesByXuids(xuids)), // make request
      )
      .subscribe(summaries);
    summaries
      .pipe(map(summaries => keyBy(summaries, e => e.xuid) as Dictionary<ApolloBanSummary>))
      .subscribe(summaryLookup => (this.summaryLookup = summaryLookup));
    summaries
      .pipe(
        map(summaries => filter(summaries, summary => summary.banCount > BigInt(0))), // only banned identities
        map(summaries => summaries.map(summary => summary.xuid)), // map to xuids
      )
      .subscribe(bannedXuids => (this.bannedXuids = bannedXuids));
  }

  /** Selects a given player. */
  public selectPlayer(identity: IdentityResultAlpha): void {
    this.selectedPlayer = identity;
  }

  public submit = (): Observable<unknown> => this.submitInternal();

  /** Submit the form. */
  public submitInternal(): Observable<unknown> {
    const identities = this.playerIdentities;
    const banOptions = this.formControls.banOptions.value as BanOptions;
    const bans: ApolloBanRequest[] = identities.map(identity => {
      return <ApolloBanRequest>{
        xuid: identity.xuid,
        banAllConsoles: banOptions.checkboxes.banAllXboxes,
        banAllPcs: banOptions.checkboxes.banAllPCs,
        deleteLeaderboardEntries: banOptions.checkboxes.deleteLeaderboardEntries,
        sendReasonNotification: true,
        reason: banOptions.banReason,
        featureArea: (banOptions.banArea as unknown) as ApolloBanArea,
        duration: banOptions.banDuration,
      };
    });

    return this.apollo.postBanPlayers(bans);
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identities: AugmentedCompositeIdentity[]): void {
    const newIdentities = identities.filter(i => i?.extra?.hasApollo).map(i => i.apollo);
    this.playerIdentities = newIdentities;
    this.playerIdentities$.next(this.playerIdentities);
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayer = identity?.extra?.hasApollo ? identity.apollo : null;
  }
}
