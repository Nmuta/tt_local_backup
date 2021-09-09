import BigNumber from 'bignumber.js';
import { Component, ViewChildren } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockBanArea, WoodstockBanRequest, WoodstockBanSummary } from '@models/woodstock';
import { AugmentedCompositeIdentity } from '@navbar-app/components/player-selection/player-selection-base.component';
import { BackgroundJob } from '@models/background-job';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { WoodstockService } from '@services/woodstock';
import { WoodstockBanHistoryComponent } from '@shared/views/ban-history/woodstock/woodstock-ban-history.component';
import { chain, Dictionary, filter, keyBy } from 'lodash';
import { EMPTY, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { BanOptions } from '../../components/ban-options/ban-options.component';
import { UserBanningBaseComponent } from '../base/user-banning.base.component';

/** Routed Component; Woodstock Banning Tool. */
@Component({
  templateUrl: './woodstock-banning.component.html',
  styleUrls: ['./woodstock-banning.component.scss'],
})
export class WoodstockBanningComponent extends UserBanningBaseComponent {
  @ViewChildren('woodstock-ban-history')
  public banHistoryComponents: WoodstockBanHistoryComponent[] = [];

  public playerIdentities$ = new Subject<IdentityResultAlpha[]>();
  public playerIdentities: IdentityResultAlpha[] = [];
  public selectedPlayerIdentity: AugmentedCompositeIdentity = null;

  public formControls = {
    banOptions: new FormControl('', [Validators.required]),
  };

  public formGroup = new FormGroup({
    banOptions: this.formControls.banOptions,
  });

  public summaryLookup: Dictionary<WoodstockBanSummary> = {};
  public bannedXuids: BigNumber[] = [];
  public selectedPlayer: IdentityResultAlpha = null;

  public identitySortFn = null;

  constructor(
    backgroundJobService: BackgroundJobService,
    private readonly woodstock: WoodstockService,
  ) {
    super(backgroundJobService);

    const summaries$ = new ReplaySubject<WoodstockBanSummary[]>(1);
    const summaryLookup$ = new ReplaySubject<Dictionary<WoodstockBanSummary>>(1);
    this.playerIdentities$
      .pipe(
        map(identities => identities.map(i => i.xuid)), // to xuid list
        switchMap(xuids => this.woodstock.getBanSummariesByXuids$(xuids)), // make request
      )
      .subscribe(summaries$);
    summaries$
      .pipe(map(summaries => keyBy(summaries, e => e.xuid) as Dictionary<WoodstockBanSummary>))
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
                const banCount = summaryLookup[i?.woodstock?.xuid?.toString()]?.banCount;
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
    const bans: WoodstockBanRequest[] = identities.map(identity => {
      return <WoodstockBanRequest>{
        xuid: identity.xuid,
        banAllConsoles: banOptions.checkboxes.banAllXboxes,
        banAllPcs: banOptions.checkboxes.banAllPCs,
        deleteLeaderboardEntries: banOptions.checkboxes.deleteLeaderboardEntries,
        sendReasonNotification: true,
        reason: banOptions.banReason,
        featureArea: (banOptions.banArea as unknown) as WoodstockBanArea,
        duration: banOptions.banDuration,
      };
    });

    return this.woodstock.postBanPlayersWithBackgroundProcessing$(bans).pipe(
      takeUntil(this.onDestroy$),
      catchError(error => {
        this.loadError = error;
        this.isLoading = false;
        return EMPTY;
      }),
      take(1),
      tap((backgroundJob: BackgroundJob<void>) => {
        this.waitForBackgroundJobToComplete(backgroundJob);
      }),
    );
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identities: AugmentedCompositeIdentity[]): void {
    const newIdentities = identities.filter(i => i?.extra?.hasWoodstock).map(i => i.woodstock);
    this.playerIdentities = newIdentities;
    this.playerIdentities$.next(this.playerIdentities);
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayer = identity?.extra?.hasWoodstock ? identity.woodstock : null;
  }

  /** True when the form can be submitted. */
  public canBan(): boolean {
    return this.formGroup.valid && this.playerIdentities.length > 0;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasWoodstock) {
      return 'Player does not have a woodstock account. Player will be ignored.';
    }

    return null;
  }
}
