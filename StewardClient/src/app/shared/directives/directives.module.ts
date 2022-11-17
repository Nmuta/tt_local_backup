import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickStopDirective } from './click-stop.directive';
import { DownloadCsvDirective } from './download-csv.directive';
import { HoverToCopyDirective } from './hover-to-copy.directive';
import { BeforeDateDirective } from './validators/before-date.directive';
import { AfterDateDirective } from './validators/after-date.directive';
import { ClickEnlargeImageDirective } from './click-enlarge-image.directive';
import { MatBadgeIconDirective } from './mat-badge-icon.directive';
import { PermissionAttributeButtonDirective } from './permissions/button-permission-attribute.directive';
import { PermissionAttributeCheckboxDirective } from './permissions/checkbox-permission-attribute.directive';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatBadgeIconDirective,
    PermissionAttributeButtonDirective,
    PermissionAttributeCheckboxDirective,
  ],
  imports: [CommonModule, MatTooltipModule],
  exports: [
    ClickStopDirective,
    DownloadCsvDirective,
    HoverToCopyDirective,
    BeforeDateDirective,
    AfterDateDirective,
    ClickEnlargeImageDirective,
    MatBadgeIconDirective,
    PermissionAttributeButtonDirective,
    PermissionAttributeCheckboxDirective,
  ],
})
export class DirectivesModule {}
