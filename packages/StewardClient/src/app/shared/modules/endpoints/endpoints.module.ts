import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndpointsNavToolComponent } from './endpoints-nav-tool/endpoints-nav-tool.component';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { HelpModule } from '../help/help.module';
import { RouterModule } from '@angular/router';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';

/**
 * Contains utility modules for interacting with currently selected endpoints.
 */
@NgModule({
  declarations: [EndpointsNavToolComponent],
  exports: [EndpointsNavToolComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    FormsModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    ErrorSpinnerModule,
    RouterModule.forChild([]),
    MatButtonToggleModule,
    HelpModule,
  ],
})
export class EndpointsModule {}
