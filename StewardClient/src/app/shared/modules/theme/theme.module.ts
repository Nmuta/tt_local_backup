import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleDarkmodeComponent } from './toggle-darkmode/toggle-darkmode.component';
import { ThemeTileContentComponent } from './theme-tile-content/theme-tile-content.component';
import { ThemeNavContentComponent } from './theme-nav-content/theme-nav-content.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/** Components and services related to theming. */
@NgModule({
  declarations: [ToggleDarkmodeComponent, ThemeTileContentComponent, ThemeNavContentComponent],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [ToggleDarkmodeComponent, ThemeTileContentComponent, ThemeNavContentComponent],
})
export class ThemeModule {}
