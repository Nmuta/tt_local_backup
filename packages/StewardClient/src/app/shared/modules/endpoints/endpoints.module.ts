import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndpointsNavToolComponent } from './endpoints-nav-tool/endpoints-nav-tool.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
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
