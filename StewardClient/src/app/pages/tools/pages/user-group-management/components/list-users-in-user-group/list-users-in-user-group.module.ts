import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ListUsersInGroupComponent } from './list-users-in-user-group.component';
import { WoodstockListUsersInGroupComponent } from './woodstock/woodstock-list-users-in-user-group.component';
import { SunriseListUsersInGroupComponent } from './sunrise/sunrise-list-users-in-user-group.component';
import { ApolloListUsersInGroupComponent } from './apollo/apollo-list-users-in-user-group.component';
import { SteelheadListUsersInGroupComponent } from './steelhead/steelhead-list-users-in-user-group.component';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

/** The create user group module. */
@NgModule({
  declarations: [
    ListUsersInGroupComponent,
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
  ],
  exports: [
    WoodstockListUsersInGroupComponent,
    SunriseListUsersInGroupComponent,
    ApolloListUsersInGroupComponent,
    SteelheadListUsersInGroupComponent,
  ],
})
export class ListUsersInUserGroupModule {}
