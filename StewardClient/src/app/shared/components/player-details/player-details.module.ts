import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';

import { PlayerDetailsComponent } from './player-details.component';

/** Defines the player details module. */
@NgModule({
  declarations: [PlayerDetailsComponent],
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  exports: [PlayerDetailsComponent],
})
export class PlayerDetailsModule {}
