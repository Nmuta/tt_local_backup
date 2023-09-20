import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatIconModule } from '@angular/material/icon';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { RouterModule } from '@angular/router';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { LuxonModule } from 'luxon-angular';
import { BountyRoutingModule } from './bounty.routing';
import { BountyComponent } from './bounty.component';
import { SteelheadSearchBountyComponent } from './pages/steelhead/steelhead-search-bounty.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';

/** Routed module for bounties. */
@NgModule({
  declarations: [BountyComponent, SteelheadSearchBountyComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    FontAwesomeModule,
    PipesModule,
    DirectivesModule,
    MatTabsModule,
    MatIconModule,
    EndpointSelectionModule,
    MatPaginatorModule,
    LuxonModule,
    MatDividerModule,
    MonitorActionModule,
    RouterModule,
    StateManagersModule,
    MatTableModule,
    BountyRoutingModule,
  ],
})
export class BountyModule {}
