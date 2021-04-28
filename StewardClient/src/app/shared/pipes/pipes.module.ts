import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BigJsonPipe } from './big-json.pipe';
import { BigNumberPipe } from './big-number.pipe';
import { HumanizePipe } from './humanize.pipe';
import { FormGroupErrorsPipe } from './form-group-errors.pipe';
import { ImpureJsonPipe } from './impure-json.pipe';
import { UtcDatePipe } from './utc-date.pipe';

/** Module for various shared pipes. */
@NgModule({
  declarations: [
    HumanizePipe,
    BigNumberPipe,
    BigJsonPipe,
    FormGroupErrorsPipe,
    ImpureJsonPipe,
    UtcDatePipe,
  ],
  imports: [CommonModule],
  exports: [
    HumanizePipe,
    BigNumberPipe,
    BigJsonPipe,
    FormGroupErrorsPipe,
    ImpureJsonPipe,
    UtcDatePipe,
  ],
})
export class PipesModule {}
