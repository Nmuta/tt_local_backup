import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
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
