import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickStopDirective } from './click-stop.directive';
import { DownloadCsvDirective } from './download-csv.directive';
import { HoverToCopyDirective } from './hover-to-copy.directive';

/**
 * Module containing various utility directives.
 */
@NgModule({
  declarations: [ClickStopDirective, DownloadCsvDirective, HoverToCopyDirective],
  imports: [CommonModule],
  exports: [ClickStopDirective, DownloadCsvDirective, HoverToCopyDirective],
})
export class DirectivesModule {}
