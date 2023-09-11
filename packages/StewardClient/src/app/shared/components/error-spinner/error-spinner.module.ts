import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';

import { ErrorSpinnerComponent } from './error-spinner.component';

/** Module for error spinner. */
@NgModule({
  declarations: [ErrorSpinnerComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ClipboardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    PipesModule,
    MatIconModule,
  ],
  exports: [ErrorSpinnerComponent],
})
export class ErrorSpinnerModule {}
