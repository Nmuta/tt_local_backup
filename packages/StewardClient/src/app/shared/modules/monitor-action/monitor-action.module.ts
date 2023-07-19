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
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { ButtonSpinnerComponent } from './button-spinner/button-spinner.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WaitForMonitorDirective } from './wait-for-monitor.directive';

/** A feature module that enables monitoring RXJS actions. */
@NgModule({
  declarations: [
    MonitorButtonDirective,
    ErrorSnackbarComponent,
    SuccessSnackbarComponent,
    MonitorCheckboxDirective,
    BigSpinnerComponent,
    InlineSpinnerComponent,
    ButtonSpinnerComponent,
    WaitForMonitorDirective,
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    ClipboardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    MonitorButtonDirective,
    MonitorCheckboxDirective,
    BigSpinnerComponent,
    InlineSpinnerComponent,
    ButtonSpinnerComponent,
    WaitForMonitorDirective,
  ],
})
export class MonitorActionModule {}
