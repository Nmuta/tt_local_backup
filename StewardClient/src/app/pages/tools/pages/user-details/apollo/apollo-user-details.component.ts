import BigNumber from 'bignumber.js';
import { Component, forwardRef, Inject } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { first } from 'lodash';
import { UserDetailsComponent } from '../user-details.component';
import { UgcType } from '@models/ugc-filters';

/** Component for displaying routed Apollo user details. */
@Component({
  selector: 'app-apollo',
  templateUrl: './apollo-user-details.component.html',
  styleUrls: ['./apollo-user-details.component.scss'],
})
export class ApolloUserDetailsComponent {
  public profileId: BigNumber;

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

  /** Called when a new profile ID is picked. */
  public onProfileIdChange(_newId: string | BigNumber): void {
    // TODO: Handle routing to this with the URL https://dev.azure.com/t10motorsport/Motorsport/_workitems/edit/652013
  }
}
