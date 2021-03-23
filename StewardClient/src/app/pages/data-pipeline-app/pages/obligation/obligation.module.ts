import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataPipelineObligationComponent } from './obligation.component';
import { DataPipelineObligationRoutingModule } from './obligation.routing';

/** Module for displaying the data pipeline obligation page. */
@NgModule({
  declarations: [DataPipelineObligationComponent],
  imports: [
    DataPipelineObligationRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    TextFieldModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
  ],
  exports: [DataPipelineObligationComponent],
})
export class DataPipelineObligationModule {}
