import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { ApolloConsolesComponent } from './apollo/apollo-consoles.component';
import { SunriseConsolesComponent } from './sunrise/sunrise-consoles.component';
import { SteelheadConsolesComponent } from './steelhead/steelhead-consoles.component';
import { WoodstockConsolesComponent } from './woodstock/woodstock-consoles.component';
import { MatIconModule } from '@angular/material/icon';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';

/** A domain module for displaying related console lists. */
@NgModule({
  declarations: [
    WoodstockConsolesComponent,
    SteelheadConsolesComponent,
    SunriseConsolesComponent,
    ApolloConsolesComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    FontAwesomeModule,
    PipesModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    VerifyButtonModule,
    StateManagersModule,
    MonitorActionModule,
    PermissionsModule,
  ],
  exports: [
    WoodstockConsolesComponent,
    SteelheadConsolesComponent,
    SunriseConsolesComponent,
    ApolloConsolesComponent,
  ],
})
export class ConsolesModule {}
