import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StuckComponent } from './stuck.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { CenterContentsModule } from '@components/center-contents/center-contents.module';

/** Module for stuck warning component. */
@NgModule({
  declarations: [StuckComponent],
  imports: [CommonModule, MatCardModule, CenterContentsModule],
  exports: [StuckComponent],
})
export class StuckModule {}
