import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardCopyComponent } from './standard-copy/standard-copy.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { StandardCopyIconComponent } from './standard-copy-icon/standard-copy-icon.component';

/** Module containing standard copy-enabling components. */
@NgModule({
  declarations: [StandardCopyComponent, StandardCopyIconComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    DirectivesModule,
    MatIconModule,
    ClipboardModule,
    MatTooltipModule,
  ],
  exports: [StandardCopyComponent, StandardCopyIconComponent],
})
export class StandardCopyModule {}
