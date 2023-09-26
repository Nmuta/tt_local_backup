import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { LocationDetailsComponent } from './location-details.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

/** Module for displaying the app's route location. */
@NgModule({
  declarations: [LocationDetailsComponent],
  imports: [
    CommonModule,
    ClipboardModule,
    FontAwesomeModule,
    RouterModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
  ],
  exports: [LocationDetailsComponent],
})
export class LocationDetailsModule {}
