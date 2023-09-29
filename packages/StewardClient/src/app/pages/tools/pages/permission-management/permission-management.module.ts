import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { PermisisionManagementRoutingModule } from './permission-management.routing';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { PermissionManagementComponent } from './permission-management.component';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StewardUserModule } from '@views/steward-user/steward-user.module';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { LuxonModule } from 'luxon-angular';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { VerifyUserSwitchDialogComponent } from './components/verify-user-switch-dialong/verify-user-switch-dialog.component';
import { VerifyUserPermissionChangeDialogComponent } from './components/verify-user-permissions-change-dialog/verify-user-permissions-change-dialog.component';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { UserPermissionManagementComponent } from './components/user-permission-management/user-permission-management.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { TeamPermissionManagementComponent } from './components/team-permission-management/team-permission-management.component';
import { SelectUserFromListComponent } from './components/select-user-from-list/select-user-from-list.component';
import { SelectTeamFromListComponent } from './components/select-team-from-list/select-team-from-list.component';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { HelpModule } from '@shared/modules/help/help.module';

/** Module for Steward permission management. */
@NgModule({
  declarations: [
    UserPermissionManagementComponent,
    TeamPermissionManagementComponent,
    PermissionManagementComponent,
    VerifyUserSwitchDialogComponent,
    VerifyUserPermissionChangeDialogComponent,
    SelectUserFromListComponent,
    SelectTeamFromListComponent,
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
    MatPaginatorModule,
    TextFieldModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    ErrorSpinnerModule,
    StewardUserModule,
    PipesModule,
    LuxonModule,
    StateManagersModule,
    MonitorActionModule,
    MatSelectModule,
    MatOptionModule,
    MatDividerModule,
    MatIconModule,
    MatTreeModule,
    MatCheckboxModule,
    MatDialogModule,
    DirectivesModule,
    MatMenuModule,
    MatTabsModule,
    MatChipsModule,
    MatAutocompleteModule,
    VerifyButtonModule,
    HelpModule,
  ],
  exports: [],
})
export class PermisisionManagementModule {}
