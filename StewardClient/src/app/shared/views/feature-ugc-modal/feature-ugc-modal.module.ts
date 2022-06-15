import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { PipesModule } from '@shared/pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SunriseFeatureUgcModalComponent } from './sunrise/sunrise-feature-ugc-modal.component';
import { WoodstockFeatureUgcModalComponent } from './woodstock/woodstock-feature-ugc-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LuxonModule } from 'luxon-angular';
import { DirectivesModule } from '@shared/directives/directives.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { LuxonDateModule } from 'ngx-material-luxon';

/** Module for setting UGC item's featured status with a modal. */
@NgModule({
  declarations: [SunriseFeatureUgcModalComponent, WoodstockFeatureUgcModalComponent],
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
    MatDatepickerModule,
    MatProgressSpinnerModule,
    JsonDumpModule,
    LuxonModule,
    DirectivesModule,
    StateManagersModule,
    MonitorActionModule,
    LuxonDateModule,
  ],
  exports: [SunriseFeatureUgcModalComponent, WoodstockFeatureUgcModalComponent],
})
export class FeatureUgcModalModule {}
