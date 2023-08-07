import { Component, forwardRef, Inject } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { first } from 'lodash';
import { UserDetailsComponent } from '../user-details.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UgcType } from '@models/ugc-filters';
import { SpecialXuid1 } from '@models/special-identity';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '@components/base-component/base.component';
import { PlayerInventoryProfile } from '@models/player-inventory-profile';
import {
  PlayFabProfile,
  WoodstockPlayersPlayFabService,
} from '@services/api-v2/woodstock/players/playfab/woodstock-players-playfab.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';

/** Component for displaying routed Woodstock user details. */
@Component({
  templateUrl: './woodstock-user-details.component.html',
  styleUrls: ['./woodstock-user-details.component.scss'],
})
export class WoodstockUserDetailsComponent extends BaseComponent {
  public profile: PlayerInventoryProfile;
  public playfabProfile: PlayFabProfile;

  public getPlayFabProfileMonitor = new ActionMonitor('Get PlayFab Profile');

  /** Used to hide unwanted tab when dealing with a special xuid. */
  public isSpecialXuid: boolean;

  public readonly UgcType = UgcType;

  /** The lookup type. */
  public get lookupType(): string {
    return this.parent.lookupType ?? '?';
  }

  /** The lookup value. */
  public get lookupName(): string {
    return first(this.parent.lookupList);
  }

  /** The specific relevant identity from the parent. */
  public get identity(): IdentityResultAlpha {
    return this.parent.identity?.woodstock;
  }

  constructor(
    private readonly playersPlayFabService: WoodstockPlayersPlayFabService,
    @Inject(forwardRef(() => UserDetailsComponent)) private parent: UserDetailsComponent,
  ) {
    super();

    this.parent.specialIdentitiesAllowed = [SpecialXuid1];
    this.parent.identity$.pipe(takeUntil(this.onDestroy$)).subscribe(() => {
      this.isSpecialXuid = this.parent.specialIdentitiesAllowed.some(x =>
        x.xuid.isEqualTo(this.identity?.xuid),
      );

      this.getPlayFabProfile();
    });
  }

  /** Called when a new profile is picked. */
  public onProfileChange(newProfile: PlayerInventoryProfile): void {
    this.profile = newProfile;
  }

  /** Hook when mat-tab changes. */
  public tabChanged($event: MatTabChangeEvent): void {
    // DO NOT REMOVE - our virtual scroller on mat-table is finnicky
    // and only displays data after resize event occurs
    if ($event.tab.textLabel === 'Deep Dive') {
      window.dispatchEvent(new Event('resize'));
    }
  }

  private getPlayFabProfile(): void {
    if (!this.identity?.xuid) {
      return;
    }

    this.getPlayFabProfileMonitor = this.getPlayFabProfileMonitor.repeat();
    this.playersPlayFabService
      .getPlayFabProfile$(this.identity.xuid)
      .pipe(this.getPlayFabProfileMonitor.monitorSingleFire())
      .subscribe(playfabProfile => {
        this.playfabProfile = playfabProfile;
      });
  }
}
