import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { PlayFabRoutingModule } from './playfab.routing';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { PlayFabComponent } from './playfab.component';
import { PlayFabBuildsManagementComponent } from './components/playfab-builds-management/playfab-builds-management.component';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { PipesModule } from '@shared/pipes/pipes.module';
import { StewardUserModule } from '@views/steward-user/steward-user.module';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { LuxonModule } from 'luxon-angular';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { EndpointSelectionModule } from '@views/endpoint-selection/endpoint-selection.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WoodstockPlayFabComponent } from './woodstock/woodstock-playfab.component';
import { WoodstockPlayFabBuildsManagementComponent } from './components/playfab-builds-management/woodstock/woodstock-playfab-builds-management.component';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { BuildLockChangeDialogComponent } from './components/build-lock-change-dialog/build-lock-change-dialog.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { PlayFabSettingsComponent } from './components/playfab-settings/playfab-settings.component';
import { FortePlayFabBuildsManagementComponent } from './components/playfab-builds-management/forte/forte-playfab-builds-management.component';
import { FortePlayFabComponent } from './forte/forte-playfab.component';
import { FortePlayFabSettingsComponent } from './components/playfab-settings/forte/forte-playfab-settings.component';
import { WoodstockPlayFabSettingsComponent } from './components/playfab-settings/woodstock/woodstock-playfab-settings.component';

/** Module for the PlayFab tool. */
@NgModule({
  declarations: [
    PlayFabComponent,
    WoodstockPlayFabComponent,
    FortePlayFabComponent,
    PlayFabBuildsManagementComponent,
    WoodstockPlayFabBuildsManagementComponent,
    FortePlayFabBuildsManagementComponent,
    BuildLockChangeDialogComponent,
    PlayFabSettingsComponent,
    WoodstockPlayFabSettingsComponent,
    FortePlayFabSettingsComponent,
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
    MatButtonToggleModule,
    MatChipsModule,
    MatExpansionModule,
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
    VerifyButtonModule,
  ],
})
export class PlayFabModule {}
