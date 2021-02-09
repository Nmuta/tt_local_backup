import { Component, forwardRef, Inject } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { first } from 'lodash';
import { UserDetailsComponent } from '../user-details.component';

/** Component for displaying routed Sunrise user details. */
@Component({
  templateUrl: './sunrise.component.html',
  styleUrls: ['./sunrise.component.scss'],
})
export class SunriseComponent {
  /** The lookup type. */
  public get lookupType(): string {
    return this.parent.lookupType ?? '?';
  }

  /** The lookup value. */
  public get lookupName(): string {
    return first(this.parent.lookupList) ?? '?';
  }

  /** The specific relevant identity from the parent. */
  public get identity(): IdentityResultAlpha {
    return this.parent.identity?.sunrise;
  }

  constructor(
    @Inject(forwardRef(() => UserDetailsComponent)) private parent: UserDetailsComponent,
  ) {}
}
