import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ContentCollapseModule } from '@components/content-collapse/content-collapse.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';

import { PlayerDetailsItemModule } from './player-details-item/player-details-item.module';
import { PlayerDetailsComponent } from './player-details.component';

/** Defines the player details module. */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatListModule,
    ErrorSpinnerModule,
    PlayerDetailsItemModule,
    ContentCollapseModule
  ],
  exports: [PlayerDetailsComponent],
  declarations: [PlayerDetailsComponent],
})
export class PlayerDetailsModule {}
