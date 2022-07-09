import { Component, forwardRef, Inject } from '@angular/core';
import { IdentityResultBeta } from '@models/identity-query.model';
import { first } from 'lodash';
import { UserDetailsComponent } from '../user-details.component';
import { GravityPseudoPlayerInventoryProfile } from '@models/gravity';

/** Component for displaying routed Gravity user details. */
@Component({
  selector: 'app-gravity',
  templateUrl: './gravity-user-details.component.html',
  styleUrls: ['./gravity-user-details.component.scss'],
})
export class GravityUserDetailsComponent {
  public profileId: string;

  /** The lookup type. */
  public get lookupType(): string {
    return this.parent.lookupType ?? '?';
  }

  /** The lookup value. */
  public get lookupName(): string {
    return first(this.parent.lookupList);
  }

  /** The specific relevant identity from the parent. */
  public get identity(): IdentityResultBeta {
    return this.parent.identity?.gravity;
  }

  constructor(
    @Inject(forwardRef(() => UserDetailsComponent)) private parent: UserDetailsComponent,
  ) {}

  /** Called when a new profile is picked. */
  public onProfileChange(newProfile: GravityPseudoPlayerInventoryProfile): void {
    this.profileId = newProfile?.profileId;
  }
}
