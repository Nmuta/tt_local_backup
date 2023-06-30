import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateLocalizedStringComponent } from './create-localized-string/create-localized-string.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { PipesModule } from '@shared/pipes/pipes.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MonitorActionModule } from '@shared/modules/monitor-action/monitor-action.module';
import { StateManagersModule } from '@shared/modules/state-managers/state-managers.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { VerifyButtonModule } from '@shared/modules/verify/verify-button.module';
import { SelectLocalizedStringComponent } from './select-localized-string/select-localized-string.component';
import { DirectivesModule } from '@shared/directives/directives.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
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
