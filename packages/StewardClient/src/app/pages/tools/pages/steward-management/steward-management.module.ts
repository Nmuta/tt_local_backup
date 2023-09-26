import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { KustoManagementComponent } from './components/kusto-management/kusto-management.component';
import { StewardManagementRoutingModule } from './steward-management.routing';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { KustoQuerySelectionModule } from '../kusto/component/kusto-query-selection/kusto-query-selection.module';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { StewardManagementComponent } from './steward-management.component';
import { ReleaseManagementComponent } from './components/release-management/release-management.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StewardUserModule } from '@views/steward-user/steward-user.module';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { LuxonModule } from 'luxon-angular';
import { CacheDeleteComponent } from './components/cache-delete/cache-delete.component';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';

/** Module for displaying the available apps, or a login button. */
@NgModule({
  declarations: [
    StewardManagementComponent,
    KustoManagementComponent,
    ReleaseManagementComponent,
    CacheDeleteComponent,
  ],
  imports: [
    StewardManagementRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatOptionModule,
    MatTableModule,
    MatTabsModule,
    MatPaginatorModule,
    TextFieldModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    KustoQuerySelectionModule,
    ErrorSpinnerModule,
    MonitorActionModule,
    StewardUserModule,
    PipesModule,
    LuxonModule,
    StateManagersModule,
  ],
  exports: [KustoManagementComponent, ReleaseManagementComponent, CacheDeleteComponent],
})
export class StewardManagementModule {}
