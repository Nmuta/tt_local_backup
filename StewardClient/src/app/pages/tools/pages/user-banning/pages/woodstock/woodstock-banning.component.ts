import BigNumber from 'bignumber.js';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockBanArea, WoodstockBanRequest, WoodstockBanSummary } from '@models/woodstock';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { BackgroundJob } from '@models/background-job';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { WoodstockService } from '@services/woodstock';
import { WoodstockBanHistoryComponent } from '@shared/views/ban-history/woodstock/woodstock-ban-history.component';
import { chain, Dictionary, filter, first, keyBy } from 'lodash';
import { EMPTY, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { BanArea, STANDARD_BAN_REASONS } from '../../components/ban-options/ban-options.component';
import { UserBanningBaseComponent } from '../base/user-banning.base.component';
import { GameTitle } from '@models/enums';
import { DurationPickerOptions } from '../../components/duration-picker/duration-picker.component';
import { WoodstockPlayersBanService } from '@services/api-v2/woodstock/players/ban/woodstock-players-ban.service';
import { BanConfiguration } from '@models/ban-configuration';
import { requireReasonListMatch } from '@helpers/validations';

type BanReasonGroup = { group: string; values: string[] };

/** Routed Component; Woodstock Banning Tool. */
@Component({
  templateUrl: './woodstock-banning.component.html',
  styleUrls: ['./woodstock-banning.component.scss'],
})
export class WoodstockBanningComponent extends UserBanningBaseComponent implements OnInit {
  @ViewChildren('woodstock-ban-history')
  public banHistoryComponents: WoodstockBanHistoryComponent[] = [];

  public playerIdentities$ = new Subject<IdentityResultAlpha[]>();
  public playerIdentities: IdentityResultAlpha[] = [];
  public selectedPlayerIdentity: AugmentedCompositeIdentity = null;

  public formControls = {
    banArea: new FormControl(BanArea.AllFeatures, [Validators.required]),
    banReason: new FormControl('', [Validators.required, requireReasonListMatch.bind(this)]),
    banConfiguration: new FormControl(null, [Validators.required]),
    banDuration: new FormControl(first(DurationPickerOptions).duration, [Validators.required]),
    overrideDuration: new FormControl(false),
    banAllDevices: new FormControl(false),
    permanentBan: new FormControl(false),
    deleteLeaderboardEntries: new FormControl(false),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  public summaryLookup: Dictionary<WoodstockBanSummary> = {};
  public bannedXuids: BigNumber[] = [];
  public selectedPlayer: IdentityResultAlpha = null;
  public banAreaEnum = BanArea;
  public banReasonOptions: Observable<BanReasonGroup[]>;
  public banConfigurations: BanConfiguration[] = null;

  public identitySortFn = null;

  public gameTitle = GameTitle.FH5;

  constructor(
    backgroundJobService: BackgroundJobService,
    private readonly woodstock: WoodstockService,
    private readonly woodstockPlayersBanService: WoodstockPlayersBanService,
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

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.woodstockPlayersBanService
      .getBanConfigurations$()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(results => {
        this.banConfigurations = results;
      });

    this.banReasonOptions = this.formControls.banReason.valueChanges.pipe(
      startWith(''),
      map((searchValue: string) => {
        if (searchValue) {
          const lowercaseSearchValue = searchValue.toLowerCase();
          return STANDARD_BAN_REASONS.map(g => {
            if (g.group.toLowerCase().startsWith(lowercaseSearchValue)) {
              return g;
            } else {
              const matchingValues = g.values.filter(v =>
                v.toLowerCase().includes(lowercaseSearchValue),
              );
              if (matchingValues.length > 0) {
                return <BanReasonGroup>{ group: g.group, values: matchingValues };
              } else {
                return null;
              }
            }
          }).filter(v => !!v);
        }

        return STANDARD_BAN_REASONS;
      }),
    );
  }

  /** Submit the form. */
  public submitBan(): void {
    const identities = this.playerIdentities;

    const bans: WoodstockBanRequest[] = identities.map(identity => {
      return <WoodstockBanRequest>{
        xuid: identity.xuid,
        banConfigurationId: this.formControls.banConfiguration.value,
        deleteLeaderboardEntries: this.formControls.deleteLeaderboardEntries.value,
        reason: this.formControls.banReason.value,
        featureArea: this.formControls.banArea.value as WoodstockBanArea,
        overrideBanDuration: this.formControls.overrideDuration.value,
        banDuration: {
          duration: this.formControls.banDuration.value,
          banAllDevices: this.formControls.banAllDevices.value,
          isPermanentBan: this.formControls.permanentBan.value,
        },
      };
    });

    this.banActionMonitor = this.banActionMonitor.repeat();
    this.woodstockPlayersBanService
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
      return 'Player does not have a woodstock account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }
}
