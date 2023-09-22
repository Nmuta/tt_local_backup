import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateLocalizedStringComponent } from './create-localized-string/create-localized-string.component';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { SelectLocalizedStringComponent } from './select-localized-string/select-localized-string.component';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { PermissionsModule } from '@shared/modules/permissions/permissions.module';

/** A utility module that exports a datetime picker component for forms. */
@NgModule({
  declarations: [CreateLocalizedStringComponent, SelectLocalizedStringComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    PipesModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MonitorActionModule,
    StateManagersModule,
    MatCheckboxModule,
    VerifyButtonModule,
    DirectivesModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatTooltipModule,
    PermissionsModule,
  ],
  exports: [CreateLocalizedStringComponent, SelectLocalizedStringComponent],
})
export class LocalizationModule {}
