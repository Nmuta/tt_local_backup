import { Component, Input } from '@angular/core';
import { ThemeEnvironmentWarningOptions } from '@shared/state/user-settings/user-settings.actions';
import { ThemeService } from '../theme.service';

/** Renders a switcher for "warn about current environment" options. */
@Component({
  selector: 'toggle-environment-warning',
  templateUrl: './toggle-environment-warning.component.html',
  styleUrls: ['./toggle-environment-warning.component.scss'],
})
export class ToggleEnvironmentWarningComponent {
  /** REVIEW-COMMENT: Is environment warning disabled. */
  @Input() public disabled: boolean;

  /** The theme override setting. */
  public get themeEnvironmentWarning(): ThemeEnvironmentWarningOptions {
    return this.themeService.themeEnvironmentWarning;
  }

  /** The theme override setting. */
  public set themeEnvironmentWarning(value: ThemeEnvironmentWarningOptions) {
    this.themeService.themeEnvironmentWarning = value;
  }

  constructor(public themeService: ThemeService) {}
}
