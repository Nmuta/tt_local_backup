import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OldChangelogComponent } from './old-changelog.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';

/** Feature module for displaying Steward changelog. */
@NgModule({
  declarations: [OldChangelogComponent],
  imports: [CommonModule, MatDividerModule, MatExpansionModule, MatIconModule],
  exports: [OldChangelogComponent],
})
export class ChangelogModule {}
