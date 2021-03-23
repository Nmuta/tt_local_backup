import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { LocationDetailsComponent } from './location-details.component';
import { MatButtonModule } from '@angular/material/button';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';

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
