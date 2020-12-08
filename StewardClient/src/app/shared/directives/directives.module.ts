import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickStopDirective } from './click-stop.directive';

/**
 * Module containing various utility directives.
 */
@NgModule({
  declarations: [ClickStopDirective],
  imports: [CommonModule],
  exports: [ClickStopDirective],
})
export class DirectivesModule {}
