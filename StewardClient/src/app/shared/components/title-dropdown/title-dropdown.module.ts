import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';


import { TitleDropdownComponent } from './title-dropdown.component';

/** Module for the verify action button. */
@NgModule({
  declarations: [TitleDropdownComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule
  ],
  exports: [TitleDropdownComponent],
})
export class TitleDropdownModule {}
