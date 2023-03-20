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
import {
  SteelheadLoyaltyRewardsService,
  SteelheadLoyaltyRewardsTitle,
} from '@services/api-v2/steelhead/player/loyalty-rewards/steelhead-loyalty-rewards.service';
import { includes, keys } from 'lodash';

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
  public getMonitor = new ActionMonitor('GET Has played records');
  public postMonitor = new ActionMonitor('POST Update played records');
  public actionLabel: string = 'Update Has Played';
  public displayLabel: string = 'Has Played';
  public singlePostMonitors: { [key: string]: ActionMonitor } = {};

  public gameTitleColumns = keys(SteelheadLoyaltyRewardsTitle);
  public playedTitles: SteelheadLoyaltyRewardsTitle[] = [];
  public titlesToSend: string[] = [];

  public allowSend: boolean = false;
  public readonly permAttribute = PermAttributeName.SendLoyaltyRewards;

  public errorSending: boolean = false;
  public errorMessage: string;
  private errorAntecedent: string = 'Failed to add the following titles to loyalty history: ';

  constructor(
    protected readonly store: Store,
    private loyaltyRewardsService: SteelheadLoyaltyRewardsService,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.getHasPlayedRecord$
      .pipe(
        tap(() => {
          this.hasPlayedRecordTable.data = [];
          this.displayedColumns = [];
          this.playedTitles = [];
          this.titlesToSend = [];
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
          { label: this.displayLabel, titles: hasPlayed },
          { label: this.actionLabel, titles: hasPlayed },
        ];

        this.singlePostMonitors = actions;
        this.hasPlayedRecordTable.data = convertedData;
        this.displayedColumns = ['label', ...this.gameTitleColumns];
      });

    this.getHasPlayedRecord$.next();
  }

  /** Called to manually send out a reward. */
  public updateTitlesPlayed(): void {
    if (!this.identity.xuid || this.identity.xuid.isNaN()) {
      return;
    }

    this.errorSending = false;
    this.errorMessage = null;
    this.postMonitor = this.postMonitor.repeat();

    this.loyaltyRewardsService
      .postUserLoyalty$(this.identity.xuid, this.titlesToSend as SteelheadLoyaltyRewardsTitle[])
      .pipe(this.postMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(userLoyaltyUpdateResults => {
        const fullSuccess = this.titlesToSend.every(title => userLoyaltyUpdateResults[title]);

        if (!fullSuccess) {
          const failures = this.titlesToSend.filter(title => !userLoyaltyUpdateResults[title]);
          this.errorMessage = this.errorAntecedent + failures.join(', ');
          this.errorSending = true;
        }

        this.getHasPlayedRecord$.next();
        this.allowSend = false;
      });
  }

  /** Controls disabled state for updating titles that have been played. */
  public toggleTitleSend($event: MatCheckboxChange, gameTitle: string): void {
    if ($event.checked) {
      this.titlesToSend.push(gameTitle);
      this.allowSend = true;
    } else {
      this.titlesToSend = this.titlesToSend.filter(title => title != gameTitle);
      this.allowSend = this.titlesToSend.length > 0;
    }
  }
}
