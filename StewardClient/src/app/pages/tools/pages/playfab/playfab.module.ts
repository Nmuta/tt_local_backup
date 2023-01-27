import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { PlayFabRoutingModule } from './playfab.routing';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { PlayFabComponent } from './playfab.component';
import { PlayFabBuildsManagementComponent } from './components/playfab-builds-management/playfab-builds-management.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StewardUserModule } from '@views/steward-user/steward-user.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LuxonModule } from 'luxon-angular';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WoodstockPlayFabComponent } from './woodstock/woodstock-playfab.component';
import { WoodstockPlayFabBuildsManagementComponent } from './components/playfab-builds-management/woodstock/woodstock-playfab-builds-management.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { BuildLockChangeDialogComponent } from './components/build-lock-change-dialog/build-lock-change-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

/** Module for displaying the available apps, or a login button. */
@NgModule({
  declarations: [
    PlayFabComponent,
    WoodstockPlayFabComponent,
    PlayFabBuildsManagementComponent,
    WoodstockPlayFabBuildsManagementComponent,
    BuildLockChangeDialogComponent,
  ],
  imports: [
    PlayFabRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    MatIconModule,
    MatOptionModule,
    MatTableModule,
    MatTabsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatToolbarModule,
    MatPaginatorModule,
    TextFieldModule,
    JsonDumpModule,
    MatProgressSpinnerModule,
    MonitorActionModule,
    StewardUserModule,
    PipesModule,
    LuxonModule,
    StateManagersModule,
    EndpointSelectionModule,
    PermissionsModule,
    VerifyCheckboxModule,
  ],
})
export class PlayFabModule {}
