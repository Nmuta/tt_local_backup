import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SunriseAuctionComponent } from './sunrise-auction/sunrise-auction.component';
import { AuctionComponent } from './auction.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { RouterModule } from '@angular/router';
import { AuctionRoutingModule } from './auction.routing';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { WoodstockAuctionComponent } from './woodstock-auction/woodstock-auction.component';
import { MatButtonModule } from '@angular/material/button';
import { WaitingForInputComponent } from './waiting-for-input/waiting-for-input.component';
import { AuctionDataComponent } from './components/auction-data/auction-data.component';
import { MatCardModule } from '@angular/material/card';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { ModelDumpModule } from '@shared/modules/model-dump/model-dump.module';
import { MatTableModule } from '@angular/material/table';
import { StandardFlagModule } from '@components/standard-flag/standard-flag.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { HelpModule } from '@shared/modules/help/help.module';
import { CacheModule } from '@shared/modules/cache/cache.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

/**
 *  Routed module for interacting with auctions.
 */
@NgModule({
  declarations: [
    SunriseAuctionComponent,
    AuctionComponent,
    WoodstockAuctionComponent,
    WaitingForInputComponent,
    AuctionDataComponent,
  ],
  imports: [
    CommonModule,
    AuctionRoutingModule,
    MatToolbarModule,
    EndpointSelectionModule,
    RouterModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule,
    MonitorActionModule,
    MatCardModule,
    StandardCopyModule,
    StandardDateModule,
    StandardFlagModule,
    ModelDumpModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    HelpModule,
    CacheModule,
    StateManagersModule,
    PermissionsModule,
    VerifyCheckboxModule,
  ],
})
export class AuctionModule {}
