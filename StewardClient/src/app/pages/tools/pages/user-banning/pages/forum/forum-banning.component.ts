import BigNumber from 'bignumber.js';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { AugmentedCompositeIdentity } from '@views/player-selection/player-selection-base.component';
import { chain, Dictionary, filter, keyBy, min } from 'lodash';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ForumBanRequest } from '@models/forum-ban-request.model';
import { ForumBanSummary } from '@models/forum-ban-summary.model';
import { BaseComponent } from '@components/base-component/base.component';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { DateTime } from 'luxon';
import { ForumBanService } from '@services/api-v2/forum/ban/forum-ban.service';

type BanReasonGroup = { group: string; values: string[] };
type StandardBanReasons = BanReasonGroup[];
const STANDARD_BAN_REASONS: StandardBanReasons = [
  {
    group: 'Forums/Communications Violations',
    values: [
      'Personal Attacks',
      'Vulgar language',
      'Posts with sole intent to antagonize users and/or disrupt the conversation',
      'Deliberate name shaming of suspected cheaters',
      'Sensitive topic discussions outside of in-game context',
      'Plotting illegal activities',
      'Threats of harm to other community members, including jokes.',
      'Circulating or distributing hacks/cheats',
      'Soliciting, plagiarism, or phishing attempts',
      'Evasion of bans/suspensions',
      'Sharing personal information',
      'Leaking unannounced content',
      'Purposeful Misinformation',
      'Disrespecting/Rebelling against Moderators',
    ],
  },
];
const ForumBanDuration = {
  1: 'Warning Message',
  2: '24 hours (Silence)',
  3: '3 days (Silence)',
  4: '1 week (Silence)',
  5: '1 month (Silence)',
  6: 'Permanent (Suspend)',
};

/** Routed Component; Forum Banning Tool. */
@Component({
  templateUrl: './forum-banning.component.html',
  styleUrls: ['./forum-banning.component.scss'],
})
export class ForumBanningComponent extends BaseComponent implements OnInit {
  public playerIdentities$ = new Subject<IdentityResultAlpha[]>();
  public playerIdentities: IdentityResultAlpha[] = [];
  public banReasonOptions: Observable<BanReasonGroup[]>;

  public formControls = {
    banReason: new FormControl('', [Validators.required]),
    issuedDate: new FormControl(DateTime.utc().startOf('day'), [Validators.required]),
  };

  public formGroup = new FormGroup(this.formControls);

  public summaryLookup: Dictionary<ForumBanSummary> = {};
  public bannedXuids: BigNumber[] = [];
  public selectedPlayer: IdentityResultAlpha = null;
  public nextBanDuration: string = null;

  public identitySortFn = null;

  public banActionMonitor = new ActionMonitor('POST Ban players');
  public getBanHistoryMonitor = new ActionMonitor('GET Ban history');
  public readonly permAttribute = PermAttributeName.BanPlayer;

  constructor(private readonly forumBanService: ForumBanService) {
    super();

    const summaries$ = new ReplaySubject<ForumBanSummary[]>(1);
    const summaryLookup$ = new ReplaySubject<Dictionary<ForumBanSummary>>(1);
    this.playerIdentities$
      .pipe(
        map(identities => identities.map(i => i.xuid)), // to xuid list
        switchMap(xuids => this.forumBanService.getBanSummariesByXuids$(xuids)), // make request
      )
      .subscribe(summaries$);
    summaries$
      .pipe(map(summaries => keyBy(summaries, e => e.xuid) as Dictionary<ForumBanSummary>))
      .subscribe(summaryLookup$);
    summaryLookup$.subscribe(summaryLookup => {
      this.summaryLookup = summaryLookup;
      this.updateNextBanDuration();
    });
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
                const banCount = summaryLookup[i?.general?.xuid?.toString()]?.banCount;
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
    const bans: ForumBanRequest[] = identities.map(identity => {
      return <ForumBanRequest>{
        xuid: identity.xuid,
        reason: this.formControls.banReason.value,
        issuedDateUtc: this.formControls.issuedDate.value,
      };
    });

    this.banActionMonitor = this.banActionMonitor.repeat();
    this.forumBanService
      .postBanPlayers$(bans)
      .pipe(this.banActionMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe();
  }

  /** Logic when player selection outputs identities. */
  public onPlayerIdentitiesChange(identities: AugmentedCompositeIdentity[]): void {
    const newIdentities = identities
      .filter(i => i?.general && i.general.error == null)
      .map(i => i.general);
    this.playerIdentities = newIdentities;
    this.playerIdentities$.next(this.playerIdentities);
  }

  /** Player identity selected */
  public playerIdentitySelected(identity: AugmentedCompositeIdentity): void {
    this.selectedPlayer = null;
    if (identity?.general && identity.general.error == null) {
      this.selectedPlayer = identity.general;
    }
    this.updateNextBanDuration();
  }

  /** True when the form can be submitted. */
  public canBan(): boolean {
    return this.formGroup.valid && this.playerIdentities.length > 0;
  }

  /** Produces a rejection message from a given identity, if it is rejected. */
  public identityRejectionFn(identity: AugmentedCompositeIdentity): string {
    if (identity?.general?.error) {
      return 'No identity found in Turn10 databases. Player will be ignored.';
    }

    return null;
  }

  /** Update the ban duration label based on the appropriate player. */
  private updateNextBanDuration() {
    const targetPlayer =
      this.playerIdentities.length == 1 ? this.playerIdentities[0] : this.selectedPlayer;

    // If no player is selected
    if (!targetPlayer || !this.summaryLookup[targetPlayer.xuid.toNumber()]) {
      this.nextBanDuration = null;
      return;
    }
    const playerBanCount =
      this.summaryLookup[targetPlayer.xuid.toNumber()].adjustedBanCount.toNumber();
    this.nextBanDuration = ForumBanDuration[min([playerBanCount + 1, 6])];
  }
}
