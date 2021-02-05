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
import { ItemSelectionComponent } from './item-selection.component';

/** The feature module for the item selection component. */
@NgModule({
  declarations: [ItemSelectionComponent],
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
  exports: [ItemSelectionComponent],
})
export class ItemSelectionModule {}
