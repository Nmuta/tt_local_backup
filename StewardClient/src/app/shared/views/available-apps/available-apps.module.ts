import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailableAppsComponent } from './available-apps.component';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';

/** Module for displaying the available apps, or a login button. */
@NgModule({
  declarations: [AvailableAppsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    FontAwesomeModule,
    RouterModule,
    MatTooltipModule,
  ],
  exports: [AvailableAppsComponent],
})
export class AvailableAppsModule { }
