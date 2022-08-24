import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ImageModalModule } from '@views/image-modal/image-modal.module';
import { SunriseUgcTableComponent } from './sunrise/sunrise-ugc-table.component';
import { WoodstockUgcTableComponent } from './woodstock/woodstock-ugc-table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { ApolloUgcTableComponent } from './apollo/apollo-ugc-table.component';
import { RouterModule } from '@angular/router';
import { FeatureUgcModalModule } from '@views/feature-ugc-modal/feature-ugc-modal.module';
import { UgcDownloadButtonModule } from '@components/ugc-download-button/ugc-download-button.module';
import { SteelheadUgcTableComponent } from './steelhead/steelhead-ugc-table.component';

/** Module for a UGC table. */
@NgModule({
  declarations: [
    SunriseUgcTableComponent,
    WoodstockUgcTableComponent,
    ApolloUgcTableComponent,
    SteelheadUgcTableComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTooltipModule,
    FontAwesomeModule,
    PipesModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    DirectivesModule,
    ClipboardModule,
    ImageModalModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MonitorActionModule,
    StateManagersModule,
    MatSnackBarModule,
    MatIconModule,
    VerifyCheckboxModule,
    RouterModule,
    FeatureUgcModalModule,
    UgcDownloadButtonModule,
  ],
  exports: [
    SunriseUgcTableComponent,
    WoodstockUgcTableComponent,
    ApolloUgcTableComponent,
    SteelheadUgcTableComponent,
  ],
})
export class UgcTableModule {}
