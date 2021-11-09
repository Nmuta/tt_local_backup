import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StandardRelativeTimeComponent } from './standard-relative-time/standard-relative-time.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StandardCopyModule } from '@components/standard-copy/standard-copy.module';
import { LuxonModule } from 'luxon-angular';
import { StandardAbsoluteTimeComponent } from './standard-absolute-time/standard-absolute-time.component';

/** Standard date controls. */
@NgModule({
  declarations: [StandardRelativeTimeComponent, StandardAbsoluteTimeComponent],
  imports: [CommonModule, MatTooltipModule, StandardCopyModule, LuxonModule, PipesModule],
  exports: [StandardRelativeTimeComponent, StandardAbsoluteTimeComponent],
})
export class StandardDateModule {}
