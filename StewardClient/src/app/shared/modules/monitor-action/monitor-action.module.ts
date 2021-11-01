import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorButtonDirective } from './monitor-button.directive';
import { ErrorSnackbarComponent } from './error-snackbar/error-snackbar.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SuccessSnackbarComponent } from './success-snackbar/success-snackbar.component';
import { MonitorCheckboxDirective } from './monitor-checkbox.directive';
import { BigSpinnerComponent } from './big-spinner/big-spinner.component';
import { InlineSpinnerComponent } from './inline-spinner/inline-spinner.component';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';

/** A feature module that enables monitoring RXJS actions. */
@NgModule({
  declarations: [
    MonitorButtonDirective,
    ErrorSnackbarComponent,
    SuccessSnackbarComponent,
    MonitorCheckboxDirective,
    BigSpinnerComponent,
    InlineSpinnerComponent,
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    ClipboardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ErrorSpinnerModule,
  ],
  exports: [
    MonitorButtonDirective,
    MonitorCheckboxDirective,
    BigSpinnerComponent,
    InlineSpinnerComponent,
  ],
})
export class MonitorActionModule {}
