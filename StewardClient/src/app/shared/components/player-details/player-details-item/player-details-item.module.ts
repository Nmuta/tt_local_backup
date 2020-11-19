import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PlayerDetailsItemComponent } from './player-details-item.component';
export { PlayerDetailsItemComponent } from './player-details-item.component';

/** Defines the ticket information item module. */
@NgModule({
  imports: [CommonModule, FontAwesomeModule],
  exports: [PlayerDetailsItemComponent],
  declarations: [PlayerDetailsItemComponent],
})
export class PlayerDetailsItemModule {}
