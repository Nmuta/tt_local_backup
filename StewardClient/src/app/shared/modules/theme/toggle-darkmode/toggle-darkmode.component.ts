import { Component, Input } from '@angular/core';
import { ThemeOverrideOptions } from '@shared/state/user-settings/user-settings.actions';
import { ThemeService } from '../theme.service';

/** Renders a full-size theme switcher. */
@Component({
  selector: 'toggle-darkmode',
  templateUrl: './toggle-darkmode.component.html',
  styleUrls: ['./toggle-darkmode.component.scss'],
})
export class ToggleDarkmodeComponent {
  @Input() public disabled: boolean;

  /** The theme override setting. */
  public get themeOverride(): ThemeOverrideOptions {
    return this.themeService.themeOverride;
  }

  /** The theme override setting. */
  public set themeOverride(value: ThemeOverrideOptions) {
    this.themeService.themeOverride = value;
  }

  constructor(public themeService: ThemeService) {}
}
