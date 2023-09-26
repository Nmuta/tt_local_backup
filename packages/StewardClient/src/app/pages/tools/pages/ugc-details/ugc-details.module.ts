import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UgcDetailsComponent } from './ugc-details.component';
import { WoodstockUgcDetailsComponent } from './pages/woodstock/woodstock-ugc-details.component';
import { SunriseUgcDetailsComponent } from './pages/sunrise/sunrise-ugc-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { RouterModule } from '@angular/router';
import { StandardCopyModule } from '@shared/modules/standard-copy/standard-copy.module';
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
import { SteelheadUgcDetailsComponent } from './pages/steelhead/steelhead-ugc-details.component';
import { SteelheadLookupComponent } from './pages/steelhead-lookup/steelhead-lookup.component';
import { SteelheadRedirectComponent } from './pages/steelhead-redirect/steelhead-redirect.component';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { DirectivesModule } from '@shared/directives/directives.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { StandardFormModule } from '@shared/modules/standard-form/standard-form.module';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { MatIconModule } from '@angular/material/icon';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { UgcOperationSnackbarComponent } from './components/ugc-action-snackbar/ugc-operation-snackbar.component';
import { PersistUgcModalModule } from '@views/persist-ugc-modal/persist-ugc-modal.module';
import { EditUgcModalModule } from '@views/edit-ugc-modal/edit-ugc-modal.module';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';

/**
 *  Routed module for interacting with UGC Details.
 */
@NgModule({
  declarations: [
    UgcDetailsComponent,
    SteelheadUgcDetailsComponent,
    WoodstockUgcDetailsComponent,
    SunriseUgcDetailsComponent,
    SteelheadLookupComponent,
    WoodstockLookupComponent,
    SunriseLookupComponent,
    SteelheadRedirectComponent,
    WoodstockRedirectComponent,
    SunriseRedirectComponent,
    UgcOperationSnackbarComponent,
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
    VerifyButtonModule,
    MatCheckboxModule,
    DirectivesModule,
    StateManagersModule,
    StandardFormModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    PermissionsModule,
    MatIconModule,
    ClipboardModule,
    PersistUgcModalModule,
    EditUgcModalModule,
  ],
})
export class UgcDetailsModule {}
