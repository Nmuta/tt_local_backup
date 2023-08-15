import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { GameTitle } from '@models/enums';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { Observable, takeUntil } from 'rxjs';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { GuidLikeString } from '@models/extended-types';
import { FullPlayerInventoryProfile } from '@models/player-inventory-profile';
import { UgcProfileInfo } from '@services/api-v2/steelhead/player/ugc-profile/steelhead-player-ugc-profile.service';

/** UGC Profile service contract. */
export interface UgcProfileServiceContract {
  /** Game title the service contract is associated with. */
  gameTitle: GameTitle;
  getUgcProfile$(xuid: BigNumber, profileId: GuidLikeString): Observable<UgcProfileInfo>;
  updateUgcProfile$(
    xuid: BigNumber,
    profileId: GuidLikeString,
    profileData: string,
  ): Observable<void>;
}

/** Component to get and set a player's UGC profile. */
@Component({
  selector: 'ugc-profile',
  templateUrl: './ugc-profile.component.html',
  styleUrls: ['./ugc-profile.component.scss'],
})
export class UgcProfileComponent extends BaseComponent implements OnChanges {
  /** skill rating service contrtact. */
  @Input() service: UgcProfileServiceContract;
  /** Player xuid. */
  @Input() xuid: BigNumber;
  /** Player profile. */
  @Input() public profile: FullPlayerInventoryProfile;

  public formControls = {
    profileData: new FormControl({ value: null, disabled: false }),
  };

  public formGroup = new FormGroup(this.formControls);

  public getMonitor = new ActionMonitor('Get UGC profile');
  public postMonitor = new ActionMonitor('Set UGC profile');

  public permAttribute = PermAttributeName.UpdateUgcProfile;

  /** A string overview of the profile ids. */
  public get profileOverviewString(): string {
    return `Profile Id: ${this.profile?.profileId} (External Id: ${
      this.profile?.externalProfileId
    }) Title Id: ${this.profile?.titleName} (${this.profile?.titleId?.toString(16)}))`;
  }

  /** Gets the service contract game title. */
  public get gameTitle(): GameTitle {
    return this.service.gameTitle;
  }

  constructor() {
    super();
  }

  /** Lifecycle hook. */
  public ngOnChanges(_changes: BetterSimpleChanges<UgcProfileComponent>): void {
    if (!this.service) {
      throw new Error('No service is defined for UGC profile component.');
    }

    if (!!this.xuid && !!this.profile?.externalProfileId) {
      this.getUgcProfile();
    }
  }

  /** Gets skill rating summary. */
  public getUgcProfile(): void {
    this.getMonitor = this.getMonitor.repeat();

    this.service
      .getUgcProfile$(this.xuid, this.profile?.externalProfileId)
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(ugcProfile => {
        console.log(ugcProfile)
      });
  }

  /** Sets skill rating override. */
  public setUgcProfile(): void {
    this.postMonitor = this.postMonitor.repeat();

    this.service
      .updateUgcProfile$(
        this.xuid,
        this.profile?.externalProfileId,
        this.formControls.profileData.value,
      )
      .pipe(this.postMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(_ => {
        console.log('No response')
      });
  }
}
