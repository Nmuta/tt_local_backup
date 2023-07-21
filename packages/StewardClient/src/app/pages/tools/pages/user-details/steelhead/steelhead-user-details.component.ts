import { Component, forwardRef, Inject, ViewChild } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { cloneDeep, first } from 'lodash';
import { UserDetailsComponent } from '../user-details.component';
import { UgcType } from '@models/ugc-filters';
import { GuidLikeString } from '@models/extended-types';
import { SteelheadPlayerProfileManagementComponent } from '@views/player-profile-management/steelhead/steelhead-player-profile-management.component';
import { FullPlayerInventoryProfile } from '@models/player-inventory-profile';
import { SteelheadReportWeightComponent } from '@views/report-weight/steelhead/steelhead-report-weight.component';

/** Component for displaying routed Steelhead user details. */
@Component({
  selector: 'app-steelhead',
  templateUrl: './steelhead-user-details.component.html',
  styleUrls: ['./steelhead-user-details.component.scss'],
})
export class SteelheadUserDetailsComponent {
  @ViewChild(SteelheadPlayerProfileManagementComponent)
  public profileManager: SteelheadPlayerProfileManagementComponent;
  @ViewChild(SteelheadReportWeightComponent)
  public reportWeight: SteelheadReportWeightComponent;
  public profile: FullPlayerInventoryProfile;

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
    return this.parent.identity?.steelhead;
  }

  /** A string overview of the profile ids. */
  public get profileOverviewString(): string {
    return `Profile Id: ${this.profile?.profileId} (External Id: ${
      this.profile?.externalProfileId
    }) Title Id: ${this.profile?.titleName} (${this.profile?.titleId?.toString(16)}))`;
  }

  constructor(
    @Inject(forwardRef(() => UserDetailsComponent)) private parent: UserDetailsComponent,
  ) {}

  /** Called when a new profile is picked. */
  public onProfileChange(newProfile: FullPlayerInventoryProfile): void {
    this.profile = newProfile as FullPlayerInventoryProfile;
  }

  /** Called when external profile id changes due to loading/reseting profile. */
  public onExternalProfileIdChange(newExternalProfileId: GuidLikeString): void {
    const tmpProfile = cloneDeep(this.profile);
    tmpProfile.externalProfileId = newExternalProfileId;
    this.profile = tmpProfile;
  }

  /** Called when player flags are changed. */
  public flagsUpdated(): void {
    this.profileManager.checkUserGroupMembership();
    this.reportWeight.reloadReportWeight();
  }
}
