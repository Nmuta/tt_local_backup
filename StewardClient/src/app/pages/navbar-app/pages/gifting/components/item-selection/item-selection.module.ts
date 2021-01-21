import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorSpinnerModule } from '@components/error-spinner/error-spinner.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipesModule } from '@shared/pipes/pipes.module';
import { JsonDumpModule } from '@components/json-dump/json-dump.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { GravityItemSelectionComponent } from './gravity/gravity-item-selection.component';
import { SunriseItemSelectionComponent } from './sunrise/sunrise-item-selection.component';
import { ApolloItemSelectionComponent } from './apollo/apollo-item-selection.component';

/** The feature module for the User Details route. */
@NgModule({
  declarations: [
    GravityItemSelectionComponent,
    SunriseItemSelectionComponent,
    ApolloItemSelectionComponent,
  ],
  imports: [
    CommonModule,
    ErrorSpinnerModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatSelectModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    PipesModule,
    JsonDumpModule,
  ],
  exports: [
    GravityItemSelectionComponent,
    SunriseItemSelectionComponent,
    ApolloItemSelectionComponent,
  ],
})
export class ItemSelectionModule {}
