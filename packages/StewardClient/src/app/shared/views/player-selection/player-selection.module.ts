import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerSelectionSingleComponent } from './single/player-selection-single.component';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PipesModule } from '@shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { PlayerSelectionBulkComponent } from './bulk/player-selection-bulk.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
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
