import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SunriseUserFlagsComponent } from './sunrise/sunrise-user-flags.component';
import { ApolloUserFlagsComponent } from './apollo/apollo-user-flags.component';
import { SteelheadUserFlagsComponent } from './steelhead/steelhead-user-flags.component';
import { MatIconModule } from '@angular/material/icon';
import { WoodstockUserFlagsComponent } from './woodstock/woodstock-user-flags.component';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { HelpModule } from '@shared/modules/help/help.module';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
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
    VerifyButtonModule,
    StateManagersModule,
    MonitorActionModule,
    PermissionsModule,
    MatIconModule,
  ],
  exports: [
    WoodstockUserFlagsComponent,
    SteelheadUserFlagsComponent,
    SunriseUserFlagsComponent,
    ApolloUserFlagsComponent,
  ],
})
export class UserFlagsModule {}
