import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ClipboardModule } from '@angular/cdk/clipboard';

import { CopyToClipboardComponent } from './copy-to-clipboard.component';

/** Module for clipboard copy button. */
@NgModule({
  declarations: [CopyToClipboardComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ClipboardModule,
    MatTooltipModule,
  ],
  exports: [CopyToClipboardComponent],
})
export class CopyToClipboardModule {}
