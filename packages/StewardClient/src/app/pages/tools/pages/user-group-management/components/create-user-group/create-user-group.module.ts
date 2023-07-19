import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';

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
