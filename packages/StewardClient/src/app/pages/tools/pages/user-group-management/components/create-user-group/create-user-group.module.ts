import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { CreateUserGroupComponent } from './create-user-group.component';
import { WoodstockCreateUserGroupComponent } from './woodstock/woodstock-create-user-group.component';
import { SunriseCreateUserGroupComponent } from './sunrise/sunrise-create-user-group.component';
import { ApolloCreateUserGroupComponent } from './apollo/apollo-create-user-group.component';
import { SteelheadCreateUserGroupComponent } from './steelhead/steelhead-create-user-group.component';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';

/** The create user group module. */
@NgModule({
  declarations: [
    CreateUserGroupComponent,
    WoodstockCreateUserGroupComponent,
    SunriseCreateUserGroupComponent,
    ApolloCreateUserGroupComponent,
    SteelheadCreateUserGroupComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatTooltipModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    StateManagersModule,
    MonitorActionModule,
    PermissionsModule,
  ],
  exports: [
    WoodstockCreateUserGroupComponent,
    SunriseCreateUserGroupComponent,
    ApolloCreateUserGroupComponent,
    SteelheadCreateUserGroupComponent,
  ],
})
export class CreateUserGroupModule {}
