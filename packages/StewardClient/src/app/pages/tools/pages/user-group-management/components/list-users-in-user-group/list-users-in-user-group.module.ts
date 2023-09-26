import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ListUsersInGroupComponent } from './list-users-in-user-group.component';
import { WoodstockListUsersInGroupComponent } from './woodstock/woodstock-list-users-in-user-group.component';
import { SunriseListUsersInGroupComponent } from './sunrise/sunrise-list-users-in-user-group.component';
import { ApolloListUsersInGroupComponent } from './apollo/apollo-list-users-in-user-group.component';
import { SteelheadListUsersInGroupComponent } from './steelhead/steelhead-list-users-in-user-group.component';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { PipesModule } from '@shared/pipes/pipes.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';

/** The create user group module. */
@NgModule({
  declarations: [
    ListUsersInGroupComponent,
    WoodstockListUsersInGroupComponent,
    SunriseListUsersInGroupComponent,
    ApolloListUsersInGroupComponent,
    SteelheadListUsersInGroupComponent,
  ],
  exports: [
    WoodstockListUsersInGroupComponent,
    SunriseListUsersInGroupComponent,
    ApolloListUsersInGroupComponent,
    SteelheadListUsersInGroupComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MonitorActionModule,
    StateManagersModule,
    MatButtonToggleModule,
    MatCardModule,
    ClipboardModule,
    PipesModule,
    StandardCopyModule,
    PermissionsModule,
    VerifyButtonModule,
  ],
})
export class ListUsersInUserGroupModule {}
