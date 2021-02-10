import { Component, forwardRef, Inject } from '@angular/core';
import { IdentityResultBeta } from '@models/identity-query.model';
import { first } from 'lodash';
import { UserDetailsComponent } from '../user-details.component';

/** Component for displaying routed Gravity user details. */
@Component({
  selector: 'app-gravity',
  templateUrl: './gravity-user-details.component.html',
  styleUrls: ['./gravity-user-details.component.scss'],
})
export class GravityComponent {
  /** The lookup type. */
  public get lookupType(): string {
    return this.parent.lookupType ?? '?';
  }

  /** The lookup value. */
  public get lookupName(): string {
    return first(this.parent.lookupList) ?? '?';
  }

  /** The specific relevant identity from the parent. */
  public get identity(): IdentityResultBeta {
    return this.parent.identity?.sunrise;
  }

  constructor(
    @Inject(forwardRef(() => UserDetailsComponent)) private parent: UserDetailsComponent,
  ) {}
}
