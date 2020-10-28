import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';

import { VerifyActionButtonComponent } from './verify-action-button.component';

/** Module for the verify action button. */
@NgModule({
  declarations: [VerifyActionButtonComponent],
  imports: [
    CommonModule,
    FormsModule,
    ErrorSpinnerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  exports: [VerifyActionButtonComponent]
})
export class VerifyActionButtonModule { }
