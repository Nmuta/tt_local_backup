import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SunriseUserFlagsComponent } from './sunrise/sunrise-user-flags.component';
import { ApolloUserFlagsComponent } from './apollo/apollo-user-flags.component';
import { SteelheadUserFlagsComponent } from './steelhead/steelhead-user-flags.component';
import { MatIconModule } from '@angular/material/icon';
import { WoodstockUserFlagsComponent } from './woodstock/woodstock-user-flags.component';
import { MatInputModule } from '@angular/material/input';
import { HelpModule } from '@shared/modules/help/help.module';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';

/** A domain module for displaying user flags. */
@NgModule({
  declarations: [
    WoodstockUserFlagsComponent,
    SteelheadUserFlagsComponent,
    SunriseUserFlagsComponent,
    ApolloUserFlagsComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ErrorSpinnerModule,
    PipesModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatIconModule,
    FormsModule,
    JsonDumpModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    HelpModule,
    VerifyCheckboxModule,
    StateManagersModule,
    MonitorActionModule,
    PermissionsModule,
  ],
  exports: [
    WoodstockUserFlagsComponent,
    SteelheadUserFlagsComponent,
    SunriseUserFlagsComponent,
    ApolloUserFlagsComponent,
  ],
})
export class UserFlagsModule {}
