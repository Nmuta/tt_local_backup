import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardCopyComponent } from './standard-copy.component';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatButtonModule } from '@angular/material/button';

/** A module containing standard copy helpers. */
@NgModule({
  declarations: [StandardCopyComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    DirectivesModule,
    MatIconModule,
    ClipboardModule,
    MatTooltipModule,
  ],
  exports: [StandardCopyComponent],
})
export class StandardCopyModule {}
