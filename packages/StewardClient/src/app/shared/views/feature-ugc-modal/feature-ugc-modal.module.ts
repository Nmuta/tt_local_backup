import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { PipesModule } from '@shared/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { SunriseFeatureUgcModalComponent } from './sunrise/sunrise-feature-ugc-modal.component';
import { WoodstockFeatureUgcModalComponent } from './woodstock/woodstock-feature-ugc-modal.component';
import { SteelheadFeatureUgcModalComponent } from './steelhead/steelhead-feature-ugc-modal.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { DirectivesModule } from '@shared/directives/directives.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { HelpModule } from '@shared/modules/help/help.module';

/** Module for setting UGC item's featured status with a modal. */
@NgModule({
  declarations: [
    SunriseFeatureUgcModalComponent,
    WoodstockFeatureUgcModalComponent,
    SteelheadFeatureUgcModalComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTooltipModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    MatIconModule,
    MatButtonModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    DirectivesModule,
    StateManagersModule,
    MonitorActionModule,
    MatDatepickerModule,
    StandardDateModule,
    VerifyButtonModule,
    PermissionsModule,
    HelpModule,
  ],
  exports: [
    SunriseFeatureUgcModalComponent,
    WoodstockFeatureUgcModalComponent,
    SteelheadFeatureUgcModalComponent,
  ],
})
export class FeatureUgcModalModule {}
