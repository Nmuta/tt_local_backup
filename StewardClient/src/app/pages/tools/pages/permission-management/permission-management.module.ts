import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { PermisisionManagementRoutingModule } from './permission-management.routing';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { PermissionManagementComponent } from './permission-management.component';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StewardUserModule } from '@views/steward-user/steward-user.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LuxonModule } from 'luxon-angular';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { VerifyUserSwitchDialogComponent } from './components/verify-user-switch-dialong/verify-user-switch-dialog.component';
import { VerifyUserPermissionChangeDialogComponent } from './components/verify-user-permissions-change-dialog/verify-user-permissions-change-dialog.component';

/** Module for displaying the available apps, or a login button. */
@NgModule({
  declarations: [
    PermissionManagementComponent,
    VerifyUserSwitchDialogComponent,
    VerifyUserPermissionChangeDialogComponent,
  ],
  imports: [
    PermisisionManagementRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    TextFieldModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    ErrorSpinnerModule,
    MonitorActionModule,
    StewardUserModule,
    PipesModule,
    LuxonModule,
    StateManagersModule,
    MatSelectModule,
    MatOptionModule,
    MatDividerModule,
    MatIconModule,
    MatTreeModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  exports: [],
})
export class PermisisionManagementModule {}
