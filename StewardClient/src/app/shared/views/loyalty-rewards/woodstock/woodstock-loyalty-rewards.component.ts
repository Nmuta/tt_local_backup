import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { BetterMatTableDataSource } from '@helpers/better-mat-table-data-source';
import { GameTitle } from '@models/enums';
import { GuidLikeString } from '@models/extended-types';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { HasPlayedRecord } from '@models/loyalty-rewards';
import { WoodstockPlayerInventoryProfile } from '@models/woodstock';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { of, Subject } from 'rxjs';
import { filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { chain } from 'lodash';
import { Store } from '@ngxs/store';
import { hasV1AccessToV1RestrictedFeature, V1RestrictedFeature } from '@environments/environment';
import { UserModel } from '@models/user.model';
import { UserState } from '@shared/state/user/user.state';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { WoodstockPlayerService } from '@services/api-v2/woodstock/player/woodstock-player.service';

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
  public profileId: string;
  public getHasPlayedRecord$ = new Subject<void>();
  public hasPlayedRecordTable = new BetterMatTableDataSource<LoyaltyRewardsDataInterface>();
  public titlesToSendRewardsTo: string[] = [];
  public gameTitleColumns: string[] = [];
  public displayedColumns: string[] = [];
  public getMonitor = new ActionMonitor('GET Has played Records');
  public postMonitor = new ActionMonitor('POST Send Loyalty Rewards');
  public singlePostMonitors: { [key: string]: ActionMonitor } = {};
  public disableSingleActions: boolean = true;
  public disableSendActions: boolean = true;
  public actionLabel: string = 'resendReward';
  public featureDisabledText = `Feature is not supported for your user role.`;

  public readonly permAttribute = PermAttributeName.SendLoyaltyRewards;

  constructor(protected readonly store: Store, private woodstockPlayerService: WoodstockPlayerService,) {
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
          this.titlesToSendRewardsTo = [];
        }),
        filter(() => !!this.externalProfileId),
        switchMap(() => {
          if (!this.identity?.xuid) {
            return of([]);
          }

          this.getMonitor = this.getMonitor.repeat();
          return this.woodstockPlayerService
            ?.getUserHasPlayedRecord$(this.identity?.xuid, this.externalProfileId)
            .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$));
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(record => {
        const hasPlayed = chain(record)
          .map(game => [game.gameTitle, game.hasPlayed])
          .fromPairs()
          .value();

        const rewardSent = chain(record)
          .map(game => [game.gameTitle, game.sentProfileNotification])
          .fromPairs()
          .value();

        const actions = chain(record)
          .map(game => [
            game.gameTitle,
            new ActionMonitor(`POST Send Loyalty Rewards for ${game.gameTitle}`),
          ])
          .fromPairs()
          .value();

        const convertedData: LoyaltyRewardsDataInterface[] = [
          { label: 'hasPlayed', titles: hasPlayed },
          { label: 'rewardSent', titles: rewardSent },
          { label: this.actionLabel },
        ];

        this.singlePostMonitors = actions;
        this.hasPlayedRecordTable.data = convertedData;
        this.gameTitleColumns = (record as HasPlayedRecord[]).map(x => x.gameTitle);
        this.displayedColumns = ['label', ...this.gameTitleColumns];

        (record as HasPlayedRecord[]).forEach(i => {
          if (i.hasPlayed === true && i.sentProfileNotification === false) {
            this.titlesToSendRewardsTo = this.titlesToSendRewardsTo.concat(i.gameTitle);
          }
        });
      });

    this.getHasPlayedRecord$.next();
  }

  /** Called when a new profile is picked. */
  public onProfileChange(newProfile: WoodstockPlayerInventoryProfile): void {
    this.externalProfileId = newProfile?.externalProfileId;

    this.getHasPlayedRecord$.next();
  }

  /** Sends rewards to players for titles they should have recieved rewards for but did not. */
  public resendRewards(): void {
    if (!this.identity.xuid || this.identity.xuid.isNaN()) {
      return;
    }
    this.postMonitor = this.postMonitor.repeat();

    this.woodstockPlayerService
      .postResendLoyaltyRewards$(
        this.identity?.xuid,
        this.externalProfileId,
        this.titlesToSendRewardsTo,
      )
      .pipe(this.postMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.getHasPlayedRecord$.next();
      });
  }

  /** Called to manually send out a reward. */
  public sendReward(gameAbbriviation: string): void {
    if (!this.identity.xuid || this.identity.xuid.isNaN()) {
      return;
    }
    this.singlePostMonitors[gameAbbriviation] = this.singlePostMonitors[gameAbbriviation].repeat();

    this.woodstockPlayerService
      .postResendLoyaltyRewards$(this.identity?.xuid, this.externalProfileId, [gameAbbriviation])
      .pipe(
        this.singlePostMonitors[gameAbbriviation].monitorSingleFire(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.disableSingleActions = true;
        this.getHasPlayedRecord$.next();
      });
  }

  /** Controls disabled state for single Legacy titles. */
  public toggleSingleSend($event: MatCheckboxChange): void {
    this.disableSingleActions = !$event.checked;
  }
}
