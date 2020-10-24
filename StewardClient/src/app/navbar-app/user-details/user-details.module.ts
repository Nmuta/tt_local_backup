import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UserDetailsComponent } from './user-details.component';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [UserDetailsComponent],
  imports: [
    CommonModule
  ]
})
export class UserDetailsModule { }
