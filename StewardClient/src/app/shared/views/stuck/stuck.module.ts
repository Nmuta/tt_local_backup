import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StuckComponent } from './stuck.component';

/** Module for stuck warning component. */
@NgModule({
  declarations: [StuckComponent],
  imports: [CommonModule],
  exports: [StuckComponent]
})
export class StuckModule { }
