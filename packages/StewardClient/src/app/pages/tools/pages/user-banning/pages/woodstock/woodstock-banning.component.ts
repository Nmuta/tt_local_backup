import BigNumber from 'bignumber.js';
import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { WoodstockBanRequest, WoodstockBanSummary } from '@models/woodstock';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { BackgroundJob } from '@models/background-job';
import { BackgroundJobService } from '@services/background-job/background-job.service';
import { WoodstockService } from '@services/woodstock';
import { WoodstockBanHistoryComponent } from '@shared/views/ban-history/woodstock/woodstock-ban-history.component';
import { chain, Dictionary, filter, keyBy } from 'lodash';
import { EMPTY, Observable, of, ReplaySubject, Subject, combineLatest, Subscription } from 'rxjs';
import {
  catchError,
  debounceTime,
  map,
  startWith,
  switchMap,
  take,
  takeUntil,
} from 'rxjs/operators';
import { BanArea } from '../../components/ban-options/ban-options.component';
import { UserBanningBaseComponent } from '../base/user-banning.base.component';
import { GameTitle } from '@models/enums';
import { WoodstockPlayersBanService } from '@services/api-v2/woodstock/players/ban/woodstock-players-ban.service';
import { BanConfiguration } from '@models/ban-configuration';
import { requireReasonListMatch } from '@helpers/validations';
import { BanReasonGroup } from '@models/ban-reason-group';
import { MatOptionSelectionChange } from '@angular/material/core/option';
import { HCI } from '@environments/environment';
import { WoodstockPlayerBanService } from '@services/api-v2/woodstock/player/ban/woodstock-player-ban.service';
import { BanDuration } from '@models/ban-duration';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Duration } from 'luxon';
import { DurationOption } from '../../components/duration-picker/duration-picker.component';

export const BanOverrideDurationOptions: DurationOption[] = [
  { duration: Duration.fromObject({ days: 1 }), humanized: '1 day' },
  { duration: Duration.fromObject({ days: 3 }), humanized: '3 days' },
  { duration: Duration.fromObject({ days: 7 }), humanized: '1 week' },
  { duration: Duration.fromObject({ days: 30 }), humanized: '1 month' },
];

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
  /** List of every ban reasons. Used in custom validation. */
  public banReasons: string[] = [];

  public formControls = {
    banReason: new FormControl('', [Validators.required, requireReasonListMatch.bind(this)]),
    deleteLeaderboardEntries: new FormControl(false),
    override: new FormControl(false),
  };

  public formGroup: FormGroup = new FormGroup(this.formControls);

  public options: DurationOption[] = BanOverrideDurationOptions;
  public overrideFormControls = {
    overrideBanDuration: new FormControl({ value: null, disabled: true }, [Validators.required]),
    permaBan: new FormControl({ value: false, disabled: true }),
    deviceBan: new FormControl({ value: false, disabled: true }),
  };

  public overrideFormGroup = new FormGroup(this.overrideFormControls);

  public summaryLookup: Dictionary<WoodstockBanSummary> = {};
  public bannedXuids: BigNumber[] = [];
  public selectedPlayer: IdentityResultAlpha = null;
  public banAreaEnum = BanArea;
  public banReasonGroups: BanReasonGroup[];
  public banReasonOptions: Observable<BanReasonGroup[]>;
  public banConfigurations: BanConfiguration[] = null;
  public selectedBanReasonGroup: BanReasonGroup = null;
  public selectedBanConfiguration: BanConfiguration = null;
  public selectedBanAreasLabel: string = '';
  public nextBanDuration: BanDuration = null;
  public nextBanDurationUser: string = '';
  public nextBanDurationMonitor: ActionMonitor = new ActionMonitor('GET next ban duration');
  public nextBanDurationSubscription: Subscription;

  public readonly overridePermAttribute = PermAttributeName.BanPlayer;

  public identitySortFn = null;

  public gameTitle = GameTitle.FH5;

  constructor(
    backgroundJobService: BackgroundJobService,
    private readonly woodstock: WoodstockService,
    private readonly woodstockPlayersBanService: WoodstockPlayersBanService,
    private readonly woodstockPlayerBanService: WoodstockPlayerBanService,
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
    const getBanConfigurations$ = this.woodstockPlayersBanService.getBanConfigurations$();

    const getBanReasonGroups$ = this.woodstockPlayersBanService.getBanReasonGroups$();

    combineLatest([getBanConfigurations$, getBanReasonGroups$])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([banConfigurations, banReasonGroups]) => {
        this.banConfigurations = banConfigurations;

        this.banReasonGroups = banReasonGroups;

        this.banReasons = [].concat(
          ...Object.values(banReasonGroups).map(group => {
            return group.reasons;
          }),
        );

        // Force autocomplete logic to run now that the values are loaded
        this.formControls.banReason.updateValueAndValidity({ emitEvent: true });
      });

    this.banReasonOptions = this.formControls.banReason.valueChanges.pipe(
      debounceTime(HCI.TypingToAutoSearchDebounceMillis),
      startWith(''),
      map((searchValue: string) => {
        if (!searchValue) {
          return this.banReasonGroups;
        }

        const lowercaseSearchValue = searchValue.toLowerCase();
        return this.banReasonGroups
          .map(group => {
            if (group.name.toLowerCase().includes(lowercaseSearchValue)) {
              return group;
            } else {
              const matchingValues = group.reasons.filter(v =>
                v.toLowerCase().includes(lowercaseSearchValue),
              );
              if (matchingValues.length > 0) {
                return <BanReasonGroup>{
                  name: group.name,
                  reasons: matchingValues,
                  banConfigurationId: group.banConfigurationId,
                  featureAreas: group.featureAreas,
                };
              } else {
                return null;
              }
            }
          })
          .filter(v => !!v);
      }),
    );
  }

  /** Submit the form. */
  public submitBan(): void {
    const identities = this.playerIdentities;

    const bans: WoodstockBanRequest[] = identities.map(identity => {
      const basicBan = {
        xuid: identity.xuid,
        deleteLeaderboardEntries: this.formControls.deleteLeaderboardEntries.value,
        reason: this.formControls.banReason.value,
        reasonGroupName: this.selectedBanReasonGroup.name,
        override: this.formControls.override.value,
      } as WoodstockBanRequest;

      if (this.formControls.override.valid) {
        basicBan.overrideDuration = this.overrideFormControls.overrideBanDuration.value;
        basicBan.overrideDurationPermanent = this.overrideFormControls.permaBan.value;
        basicBan.overrideBanConsoles = this.overrideFormControls.deviceBan.value;
      }

      return basicBan;
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
    this.updateNextBanDuration();
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayer = identity?.extra?.hasWoodstock ? identity.woodstock : null;
    this.updateNextBanDuration();
  }

  /** True when the form can be submitted. */
  public canBan(): boolean {
    return (
      this.formGroup.valid && !this.overrideFormGroup.invalid && this.playerIdentities.length > 0
    );
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (!identity?.extra?.hasWoodstock) {
      return 'Player does not have a woodstock account at the selected endpoint. Player will be ignored.';
    }

    return null;
  }

  /** Event when a ban reason is changed. */
  public banReasonChanged(event: MatOptionSelectionChange, banReasonGroup: BanReasonGroup): void {
    this.selectedBanReasonGroup = null;
    this.selectedBanConfiguration = null;
    this.selectedBanAreasLabel = '';
    if (!event.isUserInput) {
      return;
    }

    this.selectedBanReasonGroup = banReasonGroup;
    this.selectedBanConfiguration = this.banConfigurations.find(
      x => x.banConfigurationId == banReasonGroup.banConfigurationId,
    );
    this.selectedBanAreasLabel = banReasonGroup.featureAreas.join(',');
    this.updateNextBanDuration();
  }

  /** Event when ban override checkbox is toggled. */
  public onBanOverrideChange(value: MatCheckboxChange): void {
    if (!value.checked) {
      this.overrideFormControls.overrideBanDuration.setValue(null);
      this.overrideFormControls.permaBan.setValue(false);
      this.overrideFormGroup.disable();
    } else {
      this.overrideFormGroup.enable();
    }
  }

  /** Event when 'Make Ban Permanent' checkbox is toggled. */
  public onPermaBanChange(value: MatCheckboxChange): void {
    if (value.checked) {
      this.overrideFormControls.overrideBanDuration.setValue(null);
      this.overrideFormGroup.controls.overrideBanDuration.disable();
    } else {
      this.overrideFormGroup.controls.overrideBanDuration.enable();
    }
  }

  /** Update the ban duration label based on the appropriate player and ban configuration. */
  private updateNextBanDuration() {
    if (this.nextBanDurationSubscription) {
      this.nextBanDurationSubscription.unsubscribe();
    }
    const targetPlayer =
      this.playerIdentities.length == 1 ? this.playerIdentities[0] : this.selectedPlayer;

    // If no player is selected or no reason is selected
    if (!targetPlayer || !this.selectedBanConfiguration) {
      this.nextBanDuration = null;
      return;
    }

    this.nextBanDurationUser = targetPlayer.query['gamertag']
      ? targetPlayer.query['gamertag']
      : targetPlayer.query['xuid'];
    this.nextBanDurationMonitor = this.nextBanDurationMonitor.repeat();
    this.nextBanDurationSubscription = this.woodstockPlayerBanService
      .getNextBanDuration$(targetPlayer.xuid, this.selectedBanConfiguration.banConfigurationId)
      .pipe(this.nextBanDurationMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(banDuration => {
        this.nextBanDuration = banDuration;
      });
  }
}
