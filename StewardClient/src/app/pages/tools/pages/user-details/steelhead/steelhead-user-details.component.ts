import BigNumber from 'bignumber.js';
import { Component, forwardRef, Inject } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { first } from 'lodash';
import { UserDetailsComponent } from '../user-details.component';
import { SteelheadPlayerInventoryProfile } from '@models/steelhead';

/** Component for displaying routed Steelhead user details. */
@Component({
  selector: 'app-steelhead',
  templateUrl: './steelhead-user-details.component.html',
  styleUrls: ['./steelhead-user-details.component.scss'],
})
export class SteelheadUserDetailsComponent {
  public profileId: BigNumber;

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

  constructor(
    @Inject(forwardRef(() => UserDetailsComponent)) private parent: UserDetailsComponent,
  ) {}

  /** Called when a new profile is picked. */
  public onProfileChange(newProfile: SteelheadPlayerInventoryProfile): void {
    this.profileId = newProfile?.profileId;
  }
}
