import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UserDetailsComponent } from './user-details.component';
import { UserDetailsRouterModule } from './user-details.routing';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [UserDetailsComponent],
  imports: [UserDetailsRouterModule],
})
export class UserDetailsModule { }
