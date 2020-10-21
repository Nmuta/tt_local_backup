import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ProfileModule } from '@components/profile/profile.module';

import { NavbarComponent } from './navbar.component';

/** Defines the navbar module. */
@NgModule({
  declarations: [NavbarComponent],
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, ProfileModule],
  exports: [NavbarComponent],
})
export class NavbarModule {}
