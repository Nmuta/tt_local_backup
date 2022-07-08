import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerSelectionSingleComponent } from './single/player-selection-single.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PipesModule } from '@shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PlayerSelectionBulkComponent } from './bulk/player-selection-bulk.component';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from '@angular/cdk/clipboard';

/** Feature module for selecting a single player. */
@NgModule({
  declarations: [PlayerSelectionSingleComponent, PlayerSelectionBulkComponent],
  imports: [
    CommonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonToggleModule,
    PipesModule,
    FormsModule,
    ErrorSpinnerModule,
    MatTooltipModule,
    MatButtonModule,
    FontAwesomeModule,
    ClipboardModule,
  ],
  exports: [PlayerSelectionSingleComponent, PlayerSelectionBulkComponent],
})
export class PlayerSelectionModule {}
