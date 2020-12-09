import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PlayerSelectionComponent } from './player-selection.component';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    PlayerSelectionComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatButtonToggleModule,
    FontAwesomeModule,
    FormsModule,
  ],
  exports:  [
    PlayerSelectionComponent,
  ],
})
export class PlayerSelectionModule {}
