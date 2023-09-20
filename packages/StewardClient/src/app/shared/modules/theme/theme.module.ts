import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleDarkmodeComponent } from './toggle-darkmode/toggle-darkmode.component';
import { ThemeTileContentComponent } from './theme-tile-content/theme-tile-content.component';
import { ThemeNavContentComponent } from './theme-nav-content/theme-nav-content.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { ToggleEnvironmentWarningComponent } from './toggle-environment-warning/toggle-environment-warning.component';

/** Components and services related to theming. */
@NgModule({
  declarations: [
    ToggleDarkmodeComponent,
    ThemeTileContentComponent,
    ThemeNavContentComponent,
    ToggleEnvironmentWarningComponent,
  ],
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    ToggleDarkmodeComponent,
    ThemeTileContentComponent,
    ThemeNavContentComponent,
    ToggleEnvironmentWarningComponent,
  ],
})
export class ThemeModule {}
