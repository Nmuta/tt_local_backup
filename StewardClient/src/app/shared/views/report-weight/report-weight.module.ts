import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PipesModule } from '@shared/pipes/pipes.module';
import { VerifyActionButtonModule } from '@components/verify-action-button/verify-action-button.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { WoodstockReportWeightComponent } from './woodstock/woodstock-report-weight.component';
import { ReportWeightComponent } from './report-weight.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SteelheadReportWeightComponent } from './steelhead/steelhead-report-weight.component';

/** Module for getting and setting a player's report weight. */
@NgModule({
  declarations: [
    ReportWeightComponent,
    WoodstockReportWeightComponent,
    SteelheadReportWeightComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    PipesModule,
    VerifyActionButtonModule,
    JsonDumpModule,
    MatIconModule,
    MatButtonModule,
    DirectivesModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    MonitorActionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
  ],
  exports: [WoodstockReportWeightComponent, SteelheadReportWeightComponent],
})
export class ReportWeightModule {}
