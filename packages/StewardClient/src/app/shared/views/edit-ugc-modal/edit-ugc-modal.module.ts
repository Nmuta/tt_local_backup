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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DirectivesModule } from '@shared/directives/directives.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StandardDateModule } from '@components/standard-date/standard-date.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SteelheadEditUgcModalComponent } from './steelhead/steelhead-edit-ugc-modal.component';
import { WoodstockEditUgcModalComponent } from './woodstock/woodstock-edit-ugc-modal.component';
import { EditUgcModalBaseComponent } from './edit-ugc-modal.component';

/** Module for editing UGC item. */
@NgModule({
  declarations: [
    EditUgcModalBaseComponent,
    SteelheadEditUgcModalComponent,
    WoodstockEditUgcModalComponent,
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
  ],
  exports: [SteelheadEditUgcModalComponent, WoodstockEditUgcModalComponent],
})
export class EditUgcModalModule {}
