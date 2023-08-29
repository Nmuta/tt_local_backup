import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatIconModule } from '@angular/material/icon';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { RouterModule } from '@angular/router';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { LuxonModule } from 'luxon-angular';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { MatTableModule } from '@angular/material/table';
import { BountyDetailsRoutingModule } from './bounty-details.routing';
import { BountyDetailsComponent } from './bounty-details.component';
import { SteelheadBountyDetailsComponent } from './pages/steelhead/steelhead-bounty-details.component';

/** Routed module for bounty details. */
@NgModule({
  declarations: [BountyDetailsComponent, SteelheadBountyDetailsComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    PipesModule,
    DirectivesModule,
    MatIconModule,
    EndpointSelectionModule,
    LuxonModule,
    StandardCopyModule,
    MonitorActionModule,
    RouterModule,
    StateManagersModule,
    MatTableModule,
    BountyDetailsRoutingModule,
  ],
})
export class BountyDetailsModule {}
