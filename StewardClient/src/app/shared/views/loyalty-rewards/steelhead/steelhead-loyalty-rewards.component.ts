import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { GameTitle } from '@models/enums';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Store } from '@ngxs/store';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { SteelheadLoyaltyRewardsService, SteelheadLoyaltyRewardsTitle } from '@services/api-v2/steelhead/player/loyalty-rewards/steelhead-loyalty-rewards.service';
import { chain, includes, keys } from 'lodash';
import { Dictionary } from 'ts-essentials';

type LoyaltyRewardsDataInterface = {
  label: string;
  titles?: Record<string, boolean>;
};

/**
 *  Loyalty Rewards component.
 */
@Component({
  selector: 'steelhead-loyalty-rewards',
  templateUrl: './steelhead-loyalty-rewards.component.html',
  styleUrls: ['./steelhead-loyalty-rewards.component.scss'],
})
export class SteelheadLoyaltyRewardsComponent extends BaseComponent implements OnInit {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;

  public gameTitle: GameTitle = GameTitle.FM8;
  public getHasPlayedRecord$ = new Subject<void>();
  public hasPlayedRecordTable = new BetterMatTableDataSource<LoyaltyRewardsDataInterface>();
  public displayedColumns: string[] = [];
  public getMonitor = new ActionMonitor('GET Has played Records');
  public actionLabel: string = 'updateHasPlayed';
  public singlePostMonitors: { [key: string]: ActionMonitor } = {};

  public gameTitleColumns = keys(SteelheadLoyaltyRewardsTitle);
  public playedTitles: SteelheadLoyaltyRewardsTitle[] = [];

  public disableSingleActions: boolean = true;

  public readonly permAttribute = PermAttributeName.SendLoyaltyRewards;

  constructor(protected readonly store: Store, private loyaltyRewardsService: SteelheadLoyaltyRewardsService,) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.getHasPlayedRecord$
      .pipe(
        tap(() => {
          this.hasPlayedRecordTable.data = [];
          this.displayedColumns = [];
        }),
        switchMap(() => {
          if (!this.identity?.xuid) {
            return of([]);
          }

          this.getMonitor = this.getMonitor.repeat();
          return this.loyaltyRewardsService
            ?.getUserLoyalty$(this.identity?.xuid)
            .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$));
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(loyalty => {
        this.playedTitles = loyalty;

        const hasPlayed: Record<string, boolean> = {} as Record<string, boolean>;
        const actions: Record<string, ActionMonitor> = {} as Record<string, ActionMonitor>;

        this.gameTitleColumns.map(gameTitle => {
          const played = includes(loyalty, gameTitle);
          hasPlayed[gameTitle] = played;
          actions[gameTitle] = new ActionMonitor(`POST Send Loyalty Reward for ${gameTitle}`);
        });

        const convertedData: LoyaltyRewardsDataInterface[] = [
          { label: 'hasPlayed', titles: hasPlayed },
          { label: this.actionLabel, titles: hasPlayed },
        ];

        this.singlePostMonitors = actions;
        this.hasPlayedRecordTable.data = convertedData;
        this.displayedColumns = ['label', ...this.gameTitleColumns];
        console.log(this.hasPlayedRecordTable)
      });

    this.getHasPlayedRecord$.next();
  }

  /** Called to manually send out a reward. */
  public updateTitlesPlayed(gameAbbriviation: string): void {
    if (!this.identity.xuid || this.identity.xuid.isNaN()) {
      return;
    }
    this.singlePostMonitors[gameAbbriviation] = this.singlePostMonitors[gameAbbriviation].repeat();

    console.log(gameAbbriviation)
    //TODO update played titles
  }

  /** Controls disabled state for single Legacy titles. */
  public toggleSingleSend($event: MatCheckboxChange): void {
    this.disableSingleActions = !$event.checked;
  }
}
