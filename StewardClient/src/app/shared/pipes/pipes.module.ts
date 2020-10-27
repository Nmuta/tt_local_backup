import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HumanizePipe } from './humanize.pipe';


/** Module for various shared pipes. */
@NgModule({
  declarations: [HumanizePipe],
  imports: [
    CommonModule
  ],
  exports: [HumanizePipe],
})
export class PipesModule { }
