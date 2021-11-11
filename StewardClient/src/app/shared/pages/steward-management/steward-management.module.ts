import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { KustoManagementComponent } from './components/kusto-management/kusto-management.component';
import { StewardManagementRoutingModule } from './steward-management.routing';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { KustoQuerySelectionModule } from '../kusto/component/kusto-query-selection/kusto-query-selection.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { StewardManagementComponent } from './steward-management.component';
import { ReleaseManagementComponent } from './components/release-management/release-management.component';
import { MatTabsModule } from '@angular/material/tabs';

/** Module for displaying the available apps, or a login button. */
@NgModule({
  declarations: [StewardManagementComponent, KustoManagementComponent, ReleaseManagementComponent],
  imports: [
    StewardManagementRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatIconModule,
    MatOptionModule,
    MatTableModule,
    MatTabsModule,
    TextFieldModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    KustoQuerySelectionModule,
  ],
  exports: [KustoManagementComponent, ReleaseManagementComponent],
})
export class StewardManagementModule {}
