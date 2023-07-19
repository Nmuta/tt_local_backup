import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from './notifications.service';

/** Provides SignalR-based messaging hubs. */
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [NotificationsService],
})
export class HubsModule {}
