import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { EndpointSelectionComponent } from './endpoint-selection.component';

/** Module for displaying the app's route location. */
@NgModule({
  declarations: [EndpointSelectionComponent],
  imports: [CommonModule, MatTooltipModule],
  exports: [EndpointSelectionComponent],
})
export class EndpointSelectionModule {}
