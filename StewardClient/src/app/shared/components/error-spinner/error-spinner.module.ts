import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
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
  ],
  exports: [ErrorSpinnerComponent],
})
export class ErrorSpinnerModule {}
