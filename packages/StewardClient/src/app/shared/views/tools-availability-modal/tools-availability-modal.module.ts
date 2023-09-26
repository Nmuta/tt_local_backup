import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { ToolsAvailabilityModalComponent } from './tools-availability-modal.component';

/** Module to display when tools availability is down for release.. */
@NgModule({
  declarations: [ToolsAvailabilityModalComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  exports: [ToolsAvailabilityModalComponent],
})
export class ToolsAvailabilityModalModule {}
