import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PipesModule } from '@shared/pipes/pipes.module';
import { SunriseLspGroupSelectionComponent } from './sunrise/sunrise-lsp-group-selection.component';
import { ApolloLspGroupSelectionComponent } from './apollo/apollo-lsp-group-selection.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [SunriseLspGroupSelectionComponent, ApolloLspGroupSelectionComponent],
  imports: [
    CommonModule,
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
    FormsModule,
  ],
  exports: [SunriseLspGroupSelectionComponent, ApolloLspGroupSelectionComponent],
})
export class LspGroupSelectionModule {}
