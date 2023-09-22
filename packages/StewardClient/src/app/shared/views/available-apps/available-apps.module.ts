import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailableAppsComponent } from './available-apps.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';

/** Module for displaying the available apps, or a login button. */
@NgModule({
  declarations: [AvailableAppsComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    FontAwesomeModule,
    RouterModule,
    MatTooltipModule,
    MatIconModule,
    MatSlideToggleModule,
    MatDividerModule,
  ],
  exports: [AvailableAppsComponent],
})
export class AvailableAppsModule {}
