import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApolloBanArea, ApolloBanRequest, ApolloBanSummary } from '@models/apollo';
import { BackgroundJob } from '@models/background-job';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { ApolloService } from '@services/apollo';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { Dictionary, filter, keyBy } from 'lodash';
import { NEVER, Observable, Subject } from 'rxjs';
import { catchError, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { BanOptions } from '../../components/ban-options/ban-options.component';
import { UserBanningBaseComponent } from '../base/user-banning.base.component';

/** Routed Component; Apollo Banning Tool. */
@Component({
  templateUrl: './apollo-banning.component.html',
  styleUrls: ['./apollo-banning.component.scss'],
})
export class ApolloBanningComponent extends UserBanningBaseComponent {
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

  constructor(
    protected readonly backgroundJobService: BackgroundJobService,
    protected readonly apollo: ApolloService,
  ) {
    super(backgroundJobService);

    const summaries = new Subject<ApolloBanSummary[]>();
    this.formControls.playerIdentities.valueChanges
      .pipe(
        map((identities: IdentityResultAlpha[]) => identities.map(v => v.xuid)), // to xuid list
        switchMap(xuids => this.apollo.getBanSummariesByXuids(xuids)), // make requests
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
    this.isLoading = true;
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
        featureArea: (banOptions.banArea as unknown) as ApolloBanArea,
        duration: banOptions.banDuration,
      };
    });

    return this.apollo.postBanPlayersWithBackgroundProcessing(bans).pipe(
      takeUntil(this.onDestroy$),
      catchError(error => {
        this.loadError = error;
        this.isLoading = false;
        return NEVER;
      }),
      take(1),
      tap((backgroundJob: BackgroundJob<void>) => {
        this.waitForBackgroundJobToComplete(backgroundJob);
      }),
    );
  }
}
