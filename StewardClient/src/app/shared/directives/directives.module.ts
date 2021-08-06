import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickStopDirective } from './click-stop.directive';
import { DownloadCsvDirective } from './download-csv.directive';
import { HoverToCopyDirective } from './hover-to-copy.directive';
import { BeforeDateDirective } from './validators/before-date.directive';
import { AfterDateDirective } from './validators/after-date.directive';
import { ClickEnlargeImageDirective } from './click-enlarge-image.directive';

/**
 * Module containing various utility directives.
 */
@NgModule({
  declarations: [
    ClickStopDirective,
    DownloadCsvDirective,
    HoverToCopyDirective,
    BeforeDateDirective,
    AfterDateDirective,
    ClickEnlargeImageDirective,
  ],
  imports: [CommonModule],
  exports: [
    ClickStopDirective,
    DownloadCsvDirective,
    HoverToCopyDirective,
    BeforeDateDirective,
    AfterDateDirective,
    ClickEnlargeImageDirective,
  ],
})
export class DirectivesModule {}
