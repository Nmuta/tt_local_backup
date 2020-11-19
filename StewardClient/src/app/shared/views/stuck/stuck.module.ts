import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StuckComponent } from './stuck.component';
import { MatCardModule } from '@angular/material/card';

/** Module for stuck warning component. */
@NgModule({
  declarations: [StuckComponent],
  imports: [CommonModule, MatCardModule],
  exports: [StuckComponent]
})
export class StuckModule { }
