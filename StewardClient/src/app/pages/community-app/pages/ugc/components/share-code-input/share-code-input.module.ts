import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { ShareCodeInputComponent } from './share-code-input.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

/** Module for a share code input. */
@NgModule({
  declarations: [ShareCodeInputComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
  ],
  exports: [ShareCodeInputComponent],
})
export class ShareCodeInputModule {}
