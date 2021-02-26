import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BanChipIconComponent } from './ban-chip-icon.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';

/** The action icon for the ban module. */
@NgModule({
  declarations: [BanChipIconComponent],
  imports: [CommonModule, FontAwesomeModule, MatTooltipModule, ErrorSpinnerModule, MatBadgeModule],
  exports: [BanChipIconComponent],
})
export class BanChipIconModule {}