import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StandardRelativeTimeComponent } from './standard-relative-time/standard-relative-time.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StandardCopyModule } from '@components/standard-copy/standard-copy.module';
import { LuxonModule } from 'luxon-angular';
import { StandardAbsoluteTimeComponent } from './standard-absolute-time/standard-absolute-time.component';
import { StandardAbsoluteTimeRangeComponent } from './standard-absolute-time-range/standard-absolute-time-range.component';
import { StandardRelativeTimeRangeComponent } from './standard-relative-time-range/standard-relative-time-range.component';

/** Standard date controls. */
@NgModule({
  declarations: [
    StandardRelativeTimeComponent,
    StandardRelativeTimeRangeComponent,
    StandardAbsoluteTimeComponent,
    StandardAbsoluteTimeRangeComponent,
  ],
  imports: [CommonModule, MatTooltipModule, StandardCopyModule, LuxonModule, PipesModule],
  exports: [
    StandardRelativeTimeComponent,
    StandardRelativeTimeRangeComponent,
    StandardAbsoluteTimeComponent,
    StandardAbsoluteTimeRangeComponent,
  ],
})
export class StandardDateModule {}
