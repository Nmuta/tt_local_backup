import { Component, ViewChildren } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { SunriseBanArea, SunriseBanRequest, SunriseBanSummary } from '@models/sunrise';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';
import { BackgroundJob } from '@models/background-job';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { SunriseService } from '@services/sunrise';
import { SunriseBanHistoryComponent } from '@shared/views/ban-history/titles/sunrise/sunrise-ban-history.component';
import { chain, Dictionary, filter, keyBy } from 'lodash';
import { NEVER, Observable, of, ReplaySubject, Subject } from 'rxjs';
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

  public playerIdentities$ = new Subject<IdentityResultAlpha[]>();
  public playerIdentities: IdentityResultAlpha[] = [];
  public selectedPlayerIdentity: AugmentedCompositeIdentity = null;

  public formControls = {
    banOptions: new FormControl('', [Validators.required]),
  };

  public formGroup = new FormGroup({
    banOptions: this.formControls.banOptions,
  });

  public summaryLookup: Dictionary<SunriseBanSummary> = {};
  public bannedXuids: bigint[] = [];
  public selectedPlayer: IdentityResultAlpha = null;

  public identitySortFn = null;

  constructor(
    protected readonly backgroundJobService: BackgroundJobService,
    private readonly sunrise: SunriseService,
  ) {
    super(backgroundJobService);

    const summaries$ = new ReplaySubject<SunriseBanSummary[]>(1);
    const summaryLookup$ = new ReplaySubject<Dictionary<SunriseBanSummary>>(1);
    this.playerIdentities$
      .pipe(
        map(identities => identities.map(i => i.xuid)), // to xuid list
        switchMap(xuids => this.sunrise.getBanSummariesByXuids(xuids)), // make request
      )
      .subscribe(summaries$);
    summaries$
      .pipe(map(summaries => keyBy(summaries, e => e.xuid) as Dictionary<SunriseBanSummary>))
      .subscribe(summaryLookup$);
    summaryLookup$.subscribe(summaryLookup => (this.summaryLookup = summaryLookup));
    summaries$
      .pipe(
        map(summaries => filter(summaries, summary => summary.banCount > BigInt(0))), // only banned identities
        map(summaries => summaries.map(summary => summary.xuid)), // map to xuids
      )
      .subscribe(bannedXuids => (this.bannedXuids = bannedXuids));

    this.identitySortFn = identities => {
      return summaryLookup$.pipe(
        switchMap(summaryLookup => {
          return of(
            chain(identities)
              .sortBy(i => {
                const banCount = summaryLookup[i?.sunrise?.xuid?.toString()]?.banCount;
                return banCount;
              })
              .reverse()
              .value(),
          );
        }),
      );
    };
  }

  public submit = (): Observable<unknown> => this.submitInternal();

  /** Submit the form. */
  public submitInternal(): Observable<unknown> {
    this.isLoading = true;
    const identities = this.playerIdentities;
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

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identities: AugmentedCompositeIdentity[]): void {
    const newIdentities = identities.filter(i => i?.extra?.hasSunrise).map(i => i.sunrise);
    this.playerIdentities = newIdentities;
    this.playerIdentities$.next(this.playerIdentities);
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayer = identity?.extra?.hasSunrise ? identity.sunrise : null;
  }

  /** True when the form can be submitted. */
  public canBan(): boolean {
    return this.formGroup.valid && this.playerIdentities.length > 0;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasSunrise) {
      return 'Player does not have a sunrise account. Player will be ignored.';
    }

    return null;
  }
}
