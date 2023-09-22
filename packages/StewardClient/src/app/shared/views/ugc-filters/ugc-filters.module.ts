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
import { SunriseUgcFiltersComponent } from './sunrise-ugc-filters/sunrise-ugc-filters.component';
import { DirectivesModule } from '@shared/directives/directives.module';
import { WoodstockUgcFiltersComponent } from './woodstock-ugc-filters/woodstock-ugc-filters.component';
import { MakeModelAutocompleteModule } from '@views/make-model-autocomplete/make-model-autocomplete.module';
import { ApolloUgcFiltersComponent } from './apollo-ugc-filters/apollo-ugc-filters.component';
import { SteelheadUgcFiltersComponent } from './steelhead-ugc-filters/steelhead-ugc-filters.component';

/** Display for player ugcs. */
@NgModule({
  declarations: [
    SunriseUgcFiltersComponent,
    WoodstockUgcFiltersComponent,
    ApolloUgcFiltersComponent,
    SteelheadUgcFiltersComponent,
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
    MakeModelAutocompleteModule,
  ],
  exports: [
    SunriseUgcFiltersComponent,
    WoodstockUgcFiltersComponent,
    ApolloUgcFiltersComponent,
    SteelheadUgcFiltersComponent,
  ],
})
export class UgcFiltersModule {}
