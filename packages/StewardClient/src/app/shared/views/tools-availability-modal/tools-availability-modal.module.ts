import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { ToolsAvailabilityModalComponent } from './tools-availability-modal.component';

/** Module to display when tools availability is down for release.. */
@NgModule({
  declarations: [ToolsAvailabilityModalComponent],
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  exports: [ToolsAvailabilityModalComponent],
})
export class ToolsAvailabilityModalModule {}
