import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SunriseModule } from './sunrise/sunrise.module';
import { UserDetailsComponent } from './user-details.component';
import { UserDetailsRouterModule } from './user-details.routing';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [UserDetailsComponent],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    UserDetailsRouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FontAwesomeModule,
    FormsModule,
    SunriseModule,
  ],
})
export class UserDetailsModule {}
