import { Component, ViewChildren } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { BackgroundJob } from '@models/background-job';
import { IdentityResultAlpha, IdentityResultAlphaBatch } from '@models/identity-query.model';
import { SunriseBanArea, SunriseBanRequest, SunriseBanSummary } from '@models/sunrise';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { SunriseService } from '@services/sunrise';
import { SunriseBanHistoryComponent } from '@shared/views/ban-history/titles/sunrise/sunrise-ban-history.component';
import { Dictionary, filter, keyBy } from 'lodash';
import { NEVER, Observable, Subject } from 'rxjs';
import { catchError, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { BanOptions } from '../../components/ban-options/ban-options.component';
import { UserBanningBaseComponent } from '../base/user-banning.base.component';

/** Routed Component; Sunrise Banning Tool. */
@Component({
  templateUrl: './sunrise-banning.component.html',
  styleUrls: ['./sunrise-banning.component.scss'],
})
export class SunriseBanningComponent extends UserBanningBaseComponent {
  @ViewChildren('sunrise-ban-history')
  public banHistoryComponents: SunriseBanHistoryComponent[] = [];

  public formControls = {
    playerIdentities: new FormControl([], [Validators.required, Validators.minLength(1)]),
    banOptions: new FormControl('', [Validators.required]),
  };

  public formGroup = new FormGroup({
    banOptions: this.formControls.banOptions,
    playerIdentities: this.formControls.playerIdentities,
  });

  public summaryLookup: Dictionary<SunriseBanSummary> = {};
  public bannedXuids: BigInt[] = [];
  public selectedPlayer: IdentityResultAlpha = null;

  constructor(
    protected readonly backgroundJobService: BackgroundJobService,
    private readonly sunrise: SunriseService,
  ) {
    super(backgroundJobService);

    const summaries = new Subject<SunriseBanSummary[]>();
    this.formControls.playerIdentities.valueChanges
      .pipe(
        map((identities: IdentityResultAlpha[]) => identities.map(v => v.xuid)), // to xuid list
        switchMap(xuids => this.sunrise.getBanSummariesByXuids(xuids)), // make request
      )
      .subscribe(summaries);
    summaries
      .pipe(map(summaries => keyBy(summaries, e => e.xuid) as Dictionary<SunriseBanSummary>))
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
    const bans: SunriseBanRequest[] = identities.map(identity => {
      return <SunriseBanRequest>{
        xuid: identity.xuid,
        banAllConsoles: banOptions.checkboxes.banAllXboxes,
        banAllPcs: banOptions.checkboxes.banAllPCs,
        deleteLeaderboardEntries: banOptions.checkboxes.deleteLeaderboardEntries,
        sendReasonNotification: true,
        reason: banOptions.banReason,
        featureArea: (banOptions.banArea as unknown) as SunriseBanArea,
        duration: banOptions.banDuration,
      };
    });

    return this.sunrise.postBanPlayersWithBackgroundProcessing(bans).pipe(
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
