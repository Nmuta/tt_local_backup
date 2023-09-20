import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { DirectivesModule } from '@shared/directives/directives.module';
import { UgcDownloadButtonComponent } from './ugc-download-button.component';

/** Module for the ugc download button. */
@NgModule({
  declarations: [UgcDownloadButtonComponent],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    DirectivesModule,
  ],
  exports: [UgcDownloadButtonComponent],
})
export class UgcDownloadButtonModule {}
