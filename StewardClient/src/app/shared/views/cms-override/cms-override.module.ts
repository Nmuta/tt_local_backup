import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';
import { CmsOverrideComponent } from './cms-override.component';
import { WoodstockCmsOverrideComponent } from './woodstock/woodstock-cms-override.component';
import { SteelheadCmsOverrideComponent } from './steelhead/steelhead-cms-override.component';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VerifyCheckboxModule } from '@shared/modules/verify/verify-checkbox.module';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';

/** Module for getting and setting a player's cms override. */
@NgModule({
  declarations: [
    CmsOverrideComponent,
    WoodstockCmsOverrideComponent,
    SteelheadCmsOverrideComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    PipesModule,
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
    StateManagersModule,
    PermissionsModule,
    MatInputModule,
    MatCheckboxModule,
    VerifyCheckboxModule,
    ErrorSpinnerModule,
  ],
  exports: [WoodstockCmsOverrideComponent, SteelheadCmsOverrideComponent],
})
export class CmsOverrideModule {}
