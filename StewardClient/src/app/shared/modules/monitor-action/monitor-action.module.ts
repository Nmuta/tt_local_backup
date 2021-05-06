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

/** A feature module that enables monitoring RXJS actions. */
@NgModule({
  declarations: [
    MonitorButtonDirective,
    ErrorSnackbarComponent,
    SuccessSnackbarComponent,
    MonitorCheckboxDirective,
  ],
  imports: [
    CommonModule,
    MatSnackBarModule,
    ClipboardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  exports: [MonitorButtonDirective, MonitorCheckboxDirective],
})
export class MonitorActionModule {}
