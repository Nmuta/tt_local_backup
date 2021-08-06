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
import { DirectivesModule } from '@shared/directives/directives.module';
import { SunriseMakeModelAutocompleteComponent } from './sunrise-make-model-autocomplete/sunrise-make-model-autocomplete.component';
import { WoodstockMakeModelAutocompleteComponent } from './woodstock-make-model-autocomplete/woodstock-make-model-autocomplete.component';

/** Module for autocomplete input of car make & models. */
@NgModule({
  declarations: [SunriseMakeModelAutocompleteComponent, WoodstockMakeModelAutocompleteComponent],
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
  exports: [SunriseMakeModelAutocompleteComponent, WoodstockMakeModelAutocompleteComponent],
})
export class MakeModelAutocompleteModule {}
