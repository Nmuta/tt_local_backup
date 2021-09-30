import BigNumber from 'bignumber.js';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SteelheadBanArea, SteelheadBanRequest, SteelheadBanSummary } from '@models/steelhead';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';
import { BackgroundJob } from '@models/background-job';
import { SteelheadService } from '@services/steelhead';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { chain, Dictionary, filter, keyBy } from 'lodash';
import { EMPTY, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { BanOptions } from '../../components/ban-options/ban-options.component';
import { UserBanningBaseComponent } from '../base/user-banning.base.component';
/** Routed Component; Steelhead Banning Tool. */
@Component({
  templateUrl: './steelhead-banning.component.html',
  styleUrls: ['./steelhead-banning.component.scss'],
})
export class SteelheadBanningComponent extends UserBanningBaseComponent {
  public formControls = {
    banOptions: new FormControl('', [Validators.required]),
  };

  public formGroup = new FormGroup({
    banOptions: this.formControls.banOptions,
  });

  public playerIdentities$ = new Subject<IdentityResultAlpha[]>();
  public playerIdentities: IdentityResultAlpha[] = [];
  public selectedPlayerIdentity: AugmentedCompositeIdentity = null;

  public summaryLookup: Dictionary<SteelheadBanSummary> = {};
  public bannedXuids: BigNumber[] = [];
  public selectedPlayer: IdentityResultAlpha = null;

  public identitySortFn: (
    identities: AugmentedCompositeIdentity[],
  ) => Observable<AugmentedCompositeIdentity[]> = null;

  constructor(
    backgroundJobService: BackgroundJobService,
    private readonly steelhead: SteelheadService,
  ) {
    super(backgroundJobService);

    const summaries$ = new ReplaySubject<SteelheadBanSummary[]>(1);
    const summaryLookup$ = new ReplaySubject<Dictionary<SteelheadBanSummary>>(1);
    this.playerIdentities$
      .pipe(
        map(identities => identities.map(i => i.xuid)), // to xuid list
        switchMap(xuids => this.steelhead.getBanSummariesByXuids$(xuids)), // make request
      )
      .subscribe(summaries$);
    summaries$
      .pipe(map(summaries => keyBy(summaries, e => e.xuid) as Dictionary<SteelheadBanSummary>))
      .subscribe(summaryLookup$);
    summaryLookup$.subscribe(summaryLookup => (this.summaryLookup = summaryLookup));
    summaries$
      .pipe(
        map(summaries => filter(summaries, summary => summary.banCount > new BigNumber(0))), // only banned identities
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

  /** Selects a given player. */
  public selectPlayer(identity: IdentityResultAlpha): void {
    this.selectedPlayer = identity;
  }

  public submit$ = (): Observable<unknown> => this.submitInternal$();

  /** Submit the form. */
  public submitInternal$(): Observable<unknown> {
    this.isLoading = true;
    const identities = this.playerIdentities;
    const banOptions = this.formControls.banOptions.value as BanOptions;
    const bans: SteelheadBanRequest[] = identities.map(identity => {
      return <SteelheadBanRequest>{
        xuid: identity.xuid,
        banAllConsoles: banOptions.checkboxes.banAllXboxes,
        banAllPcs: banOptions.checkboxes.banAllPCs,
        deleteLeaderboardEntries: banOptions.checkboxes.deleteLeaderboardEntries,
        sendReasonNotification: true,
        reason: banOptions.banReason,
        featureArea: (banOptions.banArea as unknown) as SteelheadBanArea,
        duration: banOptions.banDuration,
      };
    });

    return this.steelhead.postBanPlayersWithBackgroundProcessing$(bans).pipe(
      catchError(error => {
        this.loadError = error;
        this.isLoading = false;
        return EMPTY;
      }),
      take(1),
      tap((backgroundJob: BackgroundJob<void>) => {
        this.waitForBackgroundJobToComplete(backgroundJob);
      }),
      takeUntil(this.onDestroy$),
    );
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identities: AugmentedCompositeIdentity[]): void {
    const newIdentities = identities.filter(i => i?.extra?.hasSteelhead).map(i => i.steelhead);
    this.playerIdentities = newIdentities;
    this.playerIdentities$.next(this.playerIdentities);
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayer = identity?.extra?.hasSteelhead ? identity.steelhead : null;
  }

  /** True when the form can be submitted. */
  public canBan(): boolean {
    return this.formGroup.valid && this.playerIdentities.length > 0;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasSteelhead) {
      return 'Player does not have an steelhead account. Player will be ignored.';
    }

    return null;
  }
}
