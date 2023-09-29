import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { PipesModule } from '@shared/pipes/pipes.module';
import { SunriseLspGroupSelectionComponent } from './sunrise/sunrise-lsp-group-selection.component';
import { ApolloLspGroupSelectionComponent } from './apollo/apollo-lsp-group-selection.component';
import { WoodstockLspGroupSelectionComponent } from './woodstock/woodstock-lsp-group-selection.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { SteelheadLspGroupSelectionComponent } from './steelhead/steelhead-lsp-group-selection.component';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    WoodstockLspGroupSelectionComponent,
    SteelheadLspGroupSelectionComponent,
    SunriseLspGroupSelectionComponent,
    ApolloLspGroupSelectionComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatFormFieldModule,
    PipesModule,
    ReactiveFormsModule,
    JsonDumpModule,
    FormsModule,
    MatAutocompleteModule,
  ],
  exports: [
    WoodstockLspGroupSelectionComponent,
    SteelheadLspGroupSelectionComponent,
    SunriseLspGroupSelectionComponent,
    ApolloLspGroupSelectionComponent,
  ],
})
export class LspGroupSelectionModule {}
