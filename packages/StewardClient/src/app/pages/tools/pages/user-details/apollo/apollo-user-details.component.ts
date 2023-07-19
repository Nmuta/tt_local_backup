import { Component, forwardRef, Inject } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { first } from 'lodash';
import { UserDetailsComponent } from '../user-details.component';
import { UgcType } from '@models/ugc-filters';
import { PlayerInventoryProfile } from '@models/player-inventory-profile';

/** Component for displaying routed Apollo user details. */
@Component({
  selector: 'app-apollo',
  templateUrl: './apollo-user-details.component.html',
  styleUrls: ['./apollo-user-details.component.scss'],
})
export class ApolloUserDetailsComponent {
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
    return this.parent.identity?.apollo;
  }

  constructor(
    @Inject(forwardRef(() => UserDetailsComponent)) private parent: UserDetailsComponent,
  ) {}

  /** Called when a new profile is picked. */
  public onProfileChange(newProfile: PlayerInventoryProfile): void {
    this.profile = newProfile;
  }
}
