import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardFlagComponent } from './standard-flag.component';
import { MatIconModule } from '@angular/material/icon';

/** Utility components for standard rendering of flags. */
@NgModule({
  declarations: [StandardFlagComponent],
  imports: [CommonModule, MatIconModule],
  exports: [StandardFlagComponent],
})
export class StandardFlagModule {}
