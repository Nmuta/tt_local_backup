import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BigJsonPipe } from './big-json.pipe';
import { BigNumberPipe } from './big-number.pipe';
import { HumanizePipe } from './humanize.pipe';
import { FormGroupErrorsPipe } from './form-group-errors.pipe';
import { ImpureJsonPipe } from './impure-json.pipe';
import { UtcDatePipe } from './utc-date.pipe';
import { DomainEnumPrettyPrintPipe } from './domain-enum-pretty-print.pipe';
import { DomainEnumPrettyPrintOrHumanizePipe } from './domain-enum-pretty-print-or-humanize.pipe';
import { DateTimeToRelativePurePipe } from './date-time-to-relative-pure.pipe';
import { DurationToMillisPipe } from './duration-to-millis.pipe';
import { ImpureBigJsonPipe } from './impure-big-json.pipe';

/** Module for various shared pipes. */
@NgModule({
  declarations: [
    HumanizePipe,
    BigNumberPipe,
    BigJsonPipe,
    FormGroupErrorsPipe,
    ImpureJsonPipe,
    ImpureBigJsonPipe,
    UtcDatePipe,
    DomainEnumPrettyPrintPipe,
    DomainEnumPrettyPrintOrHumanizePipe,
    DateTimeToRelativePurePipe,
    DurationToMillisPipe,
  ],
  imports: [CommonModule],
  exports: [
    HumanizePipe,
    BigNumberPipe,
    BigJsonPipe,
    FormGroupErrorsPipe,
    ImpureJsonPipe,
    ImpureBigJsonPipe,
    UtcDatePipe,
    DomainEnumPrettyPrintPipe,
    DomainEnumPrettyPrintOrHumanizePipe,
    DateTimeToRelativePurePipe,
    DurationToMillisPipe,
  ],
})
export class PipesModule {}
