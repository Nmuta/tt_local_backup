import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BigJsonPipe } from './big-json.pipe';
import { BigNumberPipe } from './big-number.pipe';
import { HumanizePipe } from './humanize.pipe';
import { FormGroupErrorsPipe } from './form-group-errors.pipe';
import { ImpureJsonPipe } from './impure-json.pipe';
import { UtcDatePipe } from './utc-date.pipe';
import { UserConfigDatePipe } from './user-config-date.pipe';
import { DateTimeToUserConfigDatePipe } from  './date-time-to-user-config-date.pipe';
import { DomainEnumPrettyPrintPipe } from './domain-enum-pretty-print.pipe';
import { DomainEnumPrettyPrintOrHumanizePipe } from './domain-enum-pretty-print-or-humanize.pipe';
import { DateTimeToRelativePurePipe } from './date-time-to-relative-pure.pipe';
import { DurationToMillisPipe } from './duration-to-millis.pipe';
import { ImpureBigJsonPipe } from './impure-big-json.pipe';
import { AsyncBigJsonPipe } from './async-big-json.pipe';
import { RenderGuardAsyncPipe } from './render-guard-async.pipe';
import { RenderGuardSyncPipe } from './render-guard-sync.pipe';
import { ToDateTimePipe } from './to-date-time.pipe';
import { GameTitleAbbreviationPipe } from './game-title-abbreviation.pipe';
import { GameTitleFullNamePipe } from './game-title-full-name.pipe';

/** Module for various shared pipes. */
@NgModule({
  declarations: [
    HumanizePipe,
    BigNumberPipe,
    BigJsonPipe,
    AsyncBigJsonPipe,
    FormGroupErrorsPipe,
    ImpureJsonPipe,
    ImpureBigJsonPipe,
    UtcDatePipe,
    UserConfigDatePipe,
    DateTimeToUserConfigDatePipe,
    DomainEnumPrettyPrintPipe,
    DomainEnumPrettyPrintOrHumanizePipe,
    DateTimeToRelativePurePipe,
    DurationToMillisPipe,
    RenderGuardAsyncPipe,
    RenderGuardSyncPipe,
    ToDateTimePipe,
    GameTitleAbbreviationPipe,
    GameTitleFullNamePipe,
  ],
  imports: [CommonModule],
  exports: [
    HumanizePipe,
    BigNumberPipe,
    BigJsonPipe,
    AsyncBigJsonPipe,
    FormGroupErrorsPipe,
    ImpureJsonPipe,
    ImpureBigJsonPipe,
    UtcDatePipe,
    UserConfigDatePipe,
    DateTimeToUserConfigDatePipe,
    DomainEnumPrettyPrintPipe,
    DomainEnumPrettyPrintOrHumanizePipe,
    DateTimeToRelativePurePipe,
    DurationToMillisPipe,
    RenderGuardAsyncPipe,
    RenderGuardSyncPipe,
    ToDateTimePipe,
    GameTitleAbbreviationPipe,
    GameTitleFullNamePipe,
  ],
})
export class PipesModule {}
