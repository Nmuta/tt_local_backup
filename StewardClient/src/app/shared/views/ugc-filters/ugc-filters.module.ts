import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SunriseUgcFiltersComponent } from './sunrise-ugc-filters/sunrise-ugc-filters.component';
import { DirectivesModule } from '@shared/directives/directives.module';
import { WoodstockUgcFiltersComponent } from './woodstock-ugc-filters/woodstock-ugc-filters.component';
import { MakeModelAutocompleteModule } from '@views/make-model-autocomplete/make-model-autocomplete.module';
import { ApolloUgcFiltersComponent } from './apollo-ugc-filters/apollo-ugc-filters.component';

/** Display for player ugcs. */
@NgModule({
  declarations: [
    SunriseUgcFiltersComponent,
    WoodstockUgcFiltersComponent,
    ApolloUgcFiltersComponent,
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
  exports: [SunriseUgcFiltersComponent, WoodstockUgcFiltersComponent, ApolloUgcFiltersComponent],
})
export class UgcFiltersModule {}
