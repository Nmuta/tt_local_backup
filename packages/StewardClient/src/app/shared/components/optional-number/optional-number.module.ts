import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionalNumberComponent } from './optional-number.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

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
