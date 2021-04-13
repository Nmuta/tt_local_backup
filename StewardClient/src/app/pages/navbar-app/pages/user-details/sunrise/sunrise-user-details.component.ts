import BigNumber from 'bignumber.js';
import { Component, forwardRef, Inject } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { first } from 'lodash';
import { UserDetailsComponent } from '../user-details.component';

/** Component for displaying routed Sunrise user details. */
@Component({
  templateUrl: './sunrise-user-details.component.html',
  styleUrls: ['./sunrise-user-details.component.scss'],
})
export class SunriseUserDetailsComponent {
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
    return this.parent.identity?.sunrise;
  }

  constructor(
    @Inject(forwardRef(() => UserDetailsComponent)) private parent: UserDetailsComponent,
  ) {}

  /** Called when a new profile ID is picked. */
  public onProfileIdChange(_newId: BigNumber): void {
    // TODO: Handle routing to this with the URL https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/652013
  }
}
