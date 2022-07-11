import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UgcDetailsComponent } from './ugc-details.component';
import { WoodstockUgcDetailsComponent } from './pages/woodstock/woodstock-ugc-details.component';
import { SunriseUgcDetailsComponent } from './pages/sunrise/sunrise-ugc-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { StandardCopyModule } from '@components/standard-copy/standard-copy.module';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { StandardFlagModule } from '@components/standard-flag/standard-flag.module';
import { HelpModule } from '@shared/modules/help/help.module';
import { ModelDumpModule } from '@shared/modules/model-dump/model-dump.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { AuctionRoutingModule } from './ugc-details.routing';
import { WoodstockLookupComponent } from './pages/woodstock-lookup/woodstock-lookup.component';
import { SunriseLookupComponent } from './pages/sunrise-lookup/sunrise-lookup.component';
import { WoodstockRedirectComponent } from './pages/woodstock-redirect/woodstock-redirect.component';
import { SunriseRedirectComponent } from './pages/sunrise-redirect/sunrise-redirect.component';
import { FeatureUgcModalModule } from '@views/feature-ugc-modal/feature-ugc-modal.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { UgcDownloadButtonModule } from '@components/ugc-download-button/ugc-download-button.module';

/**
 *  Routed module for interacting with UGC Details.
 */
@NgModule({
  declarations: [
    UgcDetailsComponent,
    WoodstockUgcDetailsComponent,
    SunriseUgcDetailsComponent,
    WoodstockLookupComponent,
    SunriseLookupComponent,
    WoodstockRedirectComponent,
    SunriseRedirectComponent,
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
    MonitorActionModule,
    MatCardModule,
    StandardCopyModule,
    StandardDateModule,
    StandardFlagModule,
    ModelDumpModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    HelpModule,
    FeatureUgcModalModule,
    PipesModule,
    UgcDownloadButtonModule,
  ],
})
export class UgcDetailsModule {}
