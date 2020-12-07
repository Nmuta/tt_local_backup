import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatFormField } from '@angular/material/form-field';


import { TitleDropdownComponent } from './title-dropdown.component';

/** Module for the verify action button. */
@NgModule({
  declarations: [TitleDropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatSelect,
    MatFormField
  ],
  exports: [TitleDropdownComponent],
})
export class TitleDropdownModule {}
