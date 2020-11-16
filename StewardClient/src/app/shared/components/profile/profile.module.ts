import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ProfileComponent } from './profile.component';

/** Defines the profile module. */
@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule, MatMenuModule, MatButtonModule, MatIconModule],
  exports: [ProfileComponent],
})
export class ProfileModule {}
