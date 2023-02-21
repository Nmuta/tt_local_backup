import { Component, forwardRef, Inject } from '@angular/core';
import { IdentityResultAlpha } from '@models/identity-query.model';
import { first } from 'lodash';
import { UserDetailsComponent } from '../user-details.component';

/** Component for displaying routed Forte user details. */
@Component({
  selector: 'app-forte',
  templateUrl: './forte-user-details.component.html',
  styleUrls: ['./forte-user-details.component.scss'],
})
export class ForteUserDetailsComponent {
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
    return this.parent.identity?.forte;
  }

  constructor(
    @Inject(forwardRef(() => UserDetailsComponent)) private parent: UserDetailsComponent,
  ) {}
}
