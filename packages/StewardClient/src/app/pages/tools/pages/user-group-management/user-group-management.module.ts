import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { UserGroupManagementComponent } from './user-group-management.component';
import { SunriseUserGroupManagementComponent } from './sunrise/sunrise-user-group-management.component';
import { ApolloUserGroupManagementComponent } from './apollo/apollo-user-group-management.component';
import { SteelheadUserGroupManagementComponent } from './steelhead/steelhead-user-group-management.component';
import { WoodstockUserGroupManagementComponent } from './woodstock/woodstock-user-group-management.component';

import { UserGroupManagementRouterModule } from './user-group-management.routing';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { LspGroupSelectionModule } from '@shared/views/lsp-group-selection/lsp-group-selection.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { HelpModule } from '@shared/modules/help/help.module';
import { CreateUserGroupModule } from './components/create-user-group/create-user-group.module';
import { ListUsersInUserGroupModule } from './components/list-users-in-user-group/list-users-in-user-group.module';

/** The feature module for the User Group Management route. */
@NgModule({
  declarations: [
    UserGroupManagementComponent,
    WoodstockUserGroupManagementComponent,
    SunriseUserGroupManagementComponent,
    ApolloUserGroupManagementComponent,
    SteelheadUserGroupManagementComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    UserGroupManagementRouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatTooltipModule,
    MatSlideToggleModule,
    FontAwesomeModule,
    FormsModule,
    LspGroupSelectionModule,
    MatTabsModule,
    EndpointSelectionModule,
    FormsModule,
    ReactiveFormsModule,
    HelpModule,
    CreateUserGroupModule,
    ListUsersInUserGroupModule,
  ],
})
export class UserGroupManagementModule {}
