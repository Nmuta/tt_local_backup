import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { T10BasedPlayerSelectionComponent } from './t10-based-player-selection/t10-based-player-selection.component';
import { XuidBasedPlayerSelectionComponent } from './xuid-based-player-selection/xuid-based-player-selection.component';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    T10BasedPlayerSelectionComponent,
    XuidBasedPlayerSelectionComponent
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    FontAwesomeModule,
    FormsModule,
  ],
  exports:  [
    T10BasedPlayerSelectionComponent,
    XuidBasedPlayerSelectionComponent
  ],
})
export class PlayerSelectionModule {}
