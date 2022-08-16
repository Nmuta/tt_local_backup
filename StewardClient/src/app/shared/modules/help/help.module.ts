import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpPopoverIconComponent } from './help-popover-icon/help-popover-icon.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { DirectivesModule } from '@shared/directives/directives.module';

/** Various utility components for generating helpful popovers. */
@NgModule({
  declarations: [HelpPopoverIconComponent],
  imports: [
    CommonModule,
    OverlayModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatBadgeModule,
    DirectivesModule,
  ],
  exports: [HelpPopoverIconComponent],
})
export class HelpModule {}
