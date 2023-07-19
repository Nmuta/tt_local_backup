import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EndpointSelectionComponent } from './endpoint-selection.component';

/** Module for displaying the app's route location. */
@NgModule({
  declarations: [EndpointSelectionComponent],
  imports: [CommonModule, MatTooltipModule],
  exports: [EndpointSelectionComponent],
})
export class EndpointSelectionModule {}
