import { Component, forwardRef, Inject } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { first } from 'lodash';
import { UserDetailsComponent } from '../user-details.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UgcType } from '@models/ugc-filters';
import { PlayerInventoryProfile } from '@models/player-inventory-profile';

/** Component for displaying routed Sunrise user details. */
@Component({
  templateUrl: './sunrise-user-details.component.html',
  styleUrls: ['./sunrise-user-details.component.scss'],
})
export class SunriseUserDetailsComponent {
  public profile: PlayerInventoryProfile;

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
    return this.parent.identity?.sunrise;
  }

  constructor(
    @Inject(forwardRef(() => UserDetailsComponent)) private parent: UserDetailsComponent,
  ) {}

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
}
