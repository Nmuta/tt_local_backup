import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangelogComponent } from './changelog.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

/** Feature module for displaying Steward changelog. */
@NgModule({
  declarations: [ChangelogComponent],
  imports: [CommonModule, MatDividerModule, MatExpansionModule],
  exports: [ChangelogComponent],
})
export class ChangelogModule {}
