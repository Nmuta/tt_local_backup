import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BigJsonPipe } from './big-json.pipe';
import { BigNumberPipe } from './big-number.pipe';
import { HumanizePipe } from './humanize.pipe';

/** Module for various shared pipes. */
@NgModule({
  declarations: [HumanizePipe, BigNumberPipe, BigJsonPipe],
  imports: [CommonModule],
  exports: [HumanizePipe, BigNumberPipe, BigJsonPipe],
})
export class PipesModule {}
