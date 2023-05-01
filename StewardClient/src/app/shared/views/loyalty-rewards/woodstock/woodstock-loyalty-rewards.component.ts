import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { HasPlayedRecord, WoodstockLoyaltyRewardsTitle } from '@models/loyalty-rewards';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { of, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { chain, keys } from 'lodash';
import { Store } from '@ngxs/store';
import { hasV1AccessToV1RestrictedFeature, V1RestrictedFeature } from '@environments/environment';
import { UserModel } from '@models/user.model';
import { UserState } from '@shared/state/user/user.state';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { WoodstockLoyaltyRewardsService } from '@services/api-v2/woodstock/player/loyalty-rewards/woodstock-loyalty-rewards.service';
import { PlayerInventoryProfile } from '@models/player-inventory-profile';

type LoyaltyRewardsDataInterface = {
  label: string;
  titles?: Record<string, boolean>;
};

/**
 *  Loyalty Rewards component.
 */
@Component({
  selector: 'woodstock-loyalty-rewards',
  templateUrl: './woodstock-loyalty-rewards.component.html',
  styleUrls: ['./woodstock-loyalty-rewards.component.scss'],
})
export class WoodstockLoyaltyRewardsComponent extends BaseComponent implements OnInit {
  /** Player identity. */
  @Input() identity: IdentityResultAlpha;

  public gameTitle: GameTitle = GameTitle.FH5;
  public externalProfileId: GuidLikeString;
  public getHasPlayedRecord$ = new Subject<void>();
  public hasPlayedRecordTable = new BetterMatTableDataSource<LoyaltyRewardsDataInterface>();
  public displayedColumns: string[] = [];
  public getMonitor = new ActionMonitor('GET Has played Records');
  public postMonitor = new ActionMonitor('POST Send Loyalty Rewards');
  public disableSendActions: boolean = true;
  public actionLabel: string = 'Update Has Played';
  public displayLabel: string = 'Has Played';
  public featureDisabledText = `Feature is not supported for your user role.`;

  public gameTitleColumns = keys(WoodstockLoyaltyRewardsTitle);
  public playedTitles: WoodstockLoyaltyRewardsTitle[] = [];
  public titlesToSend: string[] = [];

  public allowSend: boolean = false;
  public readonly permAttribute = PermAttributeName.SendLoyaltyRewards;

  public errorMessage: string;
  private errorAntecedent: string = 'Failed to add the following titles to loyalty history: ';

  constructor(
    protected readonly store: Store,
    private loyaltyRewardsService: WoodstockLoyaltyRewardsService,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    const user = this.store.selectSnapshot<UserModel>(UserState.profile);
    this.disableSendActions = !hasV1AccessToV1RestrictedFeature(
      V1RestrictedFeature.SendLoyaltyRewards,
      this.gameTitle,
      user.role,
    );

    this.getHasPlayedRecord$
      .pipe(
        tap(() => {
          this.hasPlayedRecordTable.data = [];
          this.displayedColumns = [];
          this.gameTitleColumns = [];
          this.titlesToSend = [];
        }),
        filter(() => !!this.externalProfileId),
        switchMap(() => {
          if (!this.identity?.xuid) {
            return of([]);
          }

          this.getMonitor = this.getMonitor.repeat();
          return this.loyaltyRewardsService
            ?.getUserLoyalty$(this.identity?.xuid, this.externalProfileId)
            .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$));
        }),
        takeUntil(this.onDestroy$),
      )
      /** Determine if we've already sent an award for a particular game title */
      .subscribe(record => {
        const hasPlayed = chain(record)
          .map(game => [game.gameTitle, game.sentProfileNotification])
          .fromPairs()
          .value();

        const convertedData: LoyaltyRewardsDataInterface[] = [
          { label: this.displayLabel, titles: hasPlayed },
          { label: this.actionLabel, titles: hasPlayed },
        ];

        this.hasPlayedRecordTable.data = convertedData;
        this.gameTitleColumns = (record as HasPlayedRecord[]).map(x => x.gameTitle);
        this.displayedColumns = ['label', ...this.gameTitleColumns];

        (record as HasPlayedRecord[]).forEach(i => {
          if (i.hasPlayed === true && i.sentProfileNotification === false) {
            this.titlesToSend = this.titlesToSend.concat(i.gameTitle);
          }
        });
      });

    this.getHasPlayedRecord$.next();
  }

  /** Called to manually send out a reward. */
  public updateTitlesPlayed(): void {
    if (!this.identity.xuid || this.identity.xuid.isNaN()) {
      return;
    }

    this.errorMessage = null;
    this.postMonitor = this.postMonitor.repeat();

    this.loyaltyRewardsService
      .postUserLoyalty$(
        this.identity.xuid,
        this.externalProfileId,
        this.titlesToSend as WoodstockLoyaltyRewardsTitle[],
      )
      .pipe(this.postMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(userLoyaltyUpdateResults => {
        const fullSuccess = this.titlesToSend.every(title => userLoyaltyUpdateResults[title]);

        if (!fullSuccess) {
          const failures = this.titlesToSend.filter(title => !userLoyaltyUpdateResults[title]);
          this.errorMessage = this.errorAntecedent + failures.join(', ');
        }

        this.getHasPlayedRecord$.next();
        this.allowSend = false;
      });
  }

  /** Called when a new profile is picked. */
  public onProfileChange(newProfile: PlayerInventoryProfile): void {
    this.externalProfileId = newProfile?.externalProfileId;

    this.getHasPlayedRecord$.next();
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
