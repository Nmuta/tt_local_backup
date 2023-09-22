import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyOptionModule as MatOptionModule } from '@angular/material/legacy-core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { DirectivesModule } from '@shared/directives/directives.module';
import { SunriseMakeModelAutocompleteComponent } from './sunrise-make-model-autocomplete/sunrise-make-model-autocomplete.component';
import { WoodstockMakeModelAutocompleteComponent } from './woodstock-make-model-autocomplete/woodstock-make-model-autocomplete.component';
import { MakeModelAutocompleteComponent } from './make-model-autocomplete/make-model-autocomplete.component';
import { ApolloMakeModelAutocompleteComponent } from './apollo-make-model-autocomplete/apollo-make-model-autocomplete.component';
import { SteelheadMakeModelAutocompleteComponent } from './steelhead-make-model-autocomplete/steelhead-make-model-autocomplete.component';

/** Module for autocomplete input of car make & models. */
@NgModule({
  declarations: [
    SunriseMakeModelAutocompleteComponent,
    WoodstockMakeModelAutocompleteComponent,
    ApolloMakeModelAutocompleteComponent,
    SteelheadMakeModelAutocompleteComponent,
    MakeModelAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    FontAwesomeModule,
    PipesModule,
    ErrorSpinnerModule,
    JsonDumpModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    DirectivesModule,
  ],
  exports: [
    SunriseMakeModelAutocompleteComponent,
    WoodstockMakeModelAutocompleteComponent,
    ApolloMakeModelAutocompleteComponent,
    SteelheadMakeModelAutocompleteComponent,
    MakeModelAutocompleteComponent,
  ],
})
export class MakeModelAutocompleteModule {}
