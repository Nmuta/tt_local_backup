import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HideChangelogModalCheckboxComponent } from './hide-changelog-modal-checkbox.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

/** Feature module for displaying Steward changelog. */
@NgModule({
  declarations: [HideChangelogModalCheckboxComponent],
  imports: [CommonModule, MatCheckboxModule, MatInputModule, FormsModule],
  exports: [HideChangelogModalCheckboxComponent],
})
export class HideChangelogModalCheckboxModule {}
