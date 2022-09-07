import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StandardRelativeTimeComponent } from './standard-relative-time/standard-relative-time.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { LuxonModule } from 'luxon-angular';
import { StandardAbsoluteTimeComponent } from './standard-absolute-time/standard-absolute-time.component';
import { StandardAbsoluteTimeRangeComponent } from './standard-absolute-time-range/standard-absolute-time-range.component';
import { StandardRelativeTimeRangeComponent } from './standard-relative-time-range/standard-relative-time-range.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLuxonDateModule } from 'ngx-material-luxon';
import { StandardAbsoluteTimeUtcComponent } from './standard-absolute-time-utc/standard-absolute-time-utc.component';
import { MatBadgeModule } from '@angular/material/badge';

/** Standard date controls. */
@NgModule({
  declarations: [
    StandardRelativeTimeComponent,
    StandardRelativeTimeRangeComponent,
    StandardAbsoluteTimeComponent,
    StandardAbsoluteTimeUtcComponent,
    StandardAbsoluteTimeRangeComponent,
  ],
  /** Reasoning for MatDatepickerModule, MatLuxonDateModule:  https://github.com/matheo/angular/discussions/21#discussioncomment-1466056 */
  imports: [
    CommonModule,
    MatTooltipModule,
    StandardCopyModule,
    LuxonModule,
    PipesModule,
    MatDatepickerModule,
    MatLuxonDateModule,
    MatBadgeModule,
  ],
  exports: [
    StandardRelativeTimeComponent,
    StandardRelativeTimeRangeComponent,
    StandardAbsoluteTimeComponent,
    StandardAbsoluteTimeUtcComponent,
    StandardAbsoluteTimeRangeComponent,
  ],
})
export class StandardDateModule {}
