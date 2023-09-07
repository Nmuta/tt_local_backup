import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ApolloBanArea, ApolloBanRequest, ApolloBanSummary } from '@models/apollo';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { BackgroundJob } from '@models/background-job';
import { ApolloService } from '@services/apollo';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { chain, Dictionary, filter, keyBy } from 'lodash';
import { EMPTY, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { BanOptions } from '../../components/ban-options/ban-options.component';
import { UserBanningBaseComponent } from '../base/user-banning.base.component';
import { GameTitle } from '@models/enums';

/** Routed Component; Apollo Banning Tool. */
@Component({
  templateUrl: './apollo-banning.component.html',
  styleUrls: ['./apollo-banning.component.scss'],
})
export class ApolloBanningComponent extends UserBanningBaseComponent {
  public formControls = {
    banOptions: new UntypedFormControl('', [Validators.required]),
  };

  public formGroup = new UntypedFormGroup({
    banOptions: this.formControls.banOptions,
  });

  public playerIdentities$ = new Subject<IdentityResultAlpha[]>();
  public playerIdentities: IdentityResultAlpha[] = [];
  public selectedPlayerIdentity: AugmentedCompositeIdentity = null;

  public summaryLookup: Dictionary<ApolloBanSummary> = {};
  public bannedXuids: BigNumber[] = [];
  public selectedPlayer: IdentityResultAlpha = null;

  public gameTitle = GameTitle.FM7;

  public identitySortFn$: (
    identities: AugmentedCompositeIdentity[],
  ) => Observable<AugmentedCompositeIdentity[]> = null;

  constructor(backgroundJobService: BackgroundJobService, private readonly apollo: ApolloService) {
    super(backgroundJobService);

    const summaries$ = new ReplaySubject<ApolloBanSummary[]>(1);
    const summaryLookup$ = new ReplaySubject<Dictionary<ApolloBanSummary>>(1);
    this.playerIdentities$
      .pipe(
        map(identities => identities.map(i => i.xuid)), // to xuid list
        switchMap(xuids => this.apollo.getBanSummariesByXuids$(xuids)), // make request
      )
      .subscribe(summaries$);
    summaries$
      .pipe(map(summaries => keyBy(summaries, e => e.xuid) as Dictionary<ApolloBanSummary>))
      .subscribe(summaryLookup$);
    summaryLookup$.subscribe(summaryLookup => (this.summaryLookup = summaryLookup));
    summaries$
      .pipe(
        map(summaries => filter(summaries, summary => summary.banCount > new BigNumber(0))), // only banned identities
        map(summaries => summaries.map(summary => summary.xuid)), // map to xuids
      )
      .subscribe(bannedXuids => (this.bannedXuids = bannedXuids));

    this.identitySortFn$ = identities => {
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

  /** Selects a given player. */
  public selectPlayer(identity: IdentityResultAlpha): void {
    this.selectedPlayer = identity;
  }

  /** Submit the form. */
  public submitBan(): void {
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
        featureArea: banOptions.banArea as unknown as ApolloBanArea,
        duration: banOptions.banDuration,
      };
    });

    this.banActionMonitor = this.banActionMonitor.repeat();
    this.apollo
      .postBanPlayersWithBackgroundProcessing$(bans)
      .pipe(
        take(1),
        switchMap((backgroundJob: BackgroundJob<void>) =>
          this.waitForBackgroundJobToComplete$(backgroundJob),
        ),
        this.banActionMonitor.monitorSingleFire(),
        catchError(() => EMPTY),
        takeUntil(this.onDestroy$),
      )
      .subscribe();
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

  /** True when the form can be submitted. */
  public canBan(): boolean {
    return this.formGroup.valid && this.playerIdentities.length > 0;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasApollo) {
      return 'Player does not have an apollo account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }
}
