import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChip, MatChipList, MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SunriseComponent } from './sunrise.component';
import { UserFlagsComponent } from './user-flags/user-flags.component';

/** Module for Sunrise UI */
@NgModule({
  declarations: [SunriseComponent, UserFlagsComponent],
  imports: [
    CommonModule,
    MatChipsModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    FormsModule,
    FontAwesomeModule,
    MatButtonModule,
  ]
})
export class SunriseModule { }
