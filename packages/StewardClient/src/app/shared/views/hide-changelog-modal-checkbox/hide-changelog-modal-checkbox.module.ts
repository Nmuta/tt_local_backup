import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HideChangelogModalCheckboxComponent } from './hide-changelog-modal-checkbox.component';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule } from '@angular/forms';

/** Feature module for displaying Steward changelog. */
@NgModule({
  declarations: [HideChangelogModalCheckboxComponent],
  imports: [CommonModule, MatCheckboxModule, MatInputModule, FormsModule],
  exports: [HideChangelogModalCheckboxComponent],
})
export class HideChangelogModalCheckboxModule {}
