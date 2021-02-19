import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickStopDirective } from './click-stop.directive';
import { DownloadCsvDirective } from './download-csv.directive';

/**
 * Module containing various utility directives.
 */
@NgModule({
  declarations: [ClickStopDirective, DownloadCsvDirective],
  imports: [CommonModule],
  exports: [ClickStopDirective, DownloadCsvDirective],
})
export class DirectivesModule {}
