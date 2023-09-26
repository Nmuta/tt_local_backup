import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { InventoryItemListDisplayComponent } from './inventory-item-list-display.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

/** A domain module for displaying related gamertags. */
@NgModule({
  declarations: [InventoryItemListDisplayComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatExpansionModule,
    FontAwesomeModule,
    PipesModule,
    JsonDumpModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    StateManagersModule,
    PermissionsModule,
    VerifyButtonModule,
    MonitorActionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    // TODO: Cars coming next as credits were top priority (lugeiken 2023/05/09)
    // EditCarItemModalModule,
  ],
  exports: [InventoryItemListDisplayComponent],
})
export class InventoryItemListDisplayModule {}
