import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionalNumberComponent } from './optional-number.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

/** A utility form component enabling optional numbers. */
@NgModule({
  declarations: [OptionalNumberComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatTooltipModule,
  ],
  exports: [OptionalNumberComponent],
})
export class OptionalNumberModule {}
