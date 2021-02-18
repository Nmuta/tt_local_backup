import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerSelectionSingleComponent } from './player-selection-single.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PipesModule } from '@shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatTooltipModule } from '@angular/material/tooltip';

/** Feature module for selecting a single player. */
@NgModule({
  declarations: [PlayerSelectionSingleComponent],
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
  ],
  exports: [PlayerSelectionSingleComponent],
})
export class PlayerSelectionSingleModule {}
