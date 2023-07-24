import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HelpModule } from '@shared/modules/help/help.module';
import { LspTasksComponent } from './lsp-tasks.component';
import { LspTasksRoutingModule } from './lsp-tasks.routing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { LspTaskManagementComponent } from './components/lsp-task-management.component';
import { WoodstockLspTaskManagementComponent } from './components/woodstock/woodstock-lsp-task-management.component';
import { SteelheadLspTaskManagementComponent } from './components/steelhead/steelhead-lsp-task-management.component';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatTableModule } from '@angular/material/table';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DateTimePickersModule } from '@components/date-time-pickers/date-time-pickers.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';

/** Module for displaying the current lsp tasks. */
@NgModule({
  declarations: [
    LspTasksComponent,
    LspTaskManagementComponent,
    WoodstockLspTaskManagementComponent,
    SteelheadLspTaskManagementComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    LspTasksRoutingModule,
    MatInputModule,
    MatTooltipModule,
    TextFieldModule,
    MatProgressSpinnerModule,
    HelpModule,
    MatToolbarModule,
    EndpointSelectionModule,
    PipesModule,
    MatTableModule,
    MonitorActionModule,
    PermissionsModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule,
    DateTimePickersModule,
    StateManagersModule,
  ],
})
export class LspTasksModule {}
