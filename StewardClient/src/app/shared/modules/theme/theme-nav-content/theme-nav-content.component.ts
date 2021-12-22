import { Component, Input } from '@angular/core';
import { CustomTileComponent } from '@environments/environment';
import { ThemeOverrideOptions } from '@shared/state/user-settings/user-settings.actions';
import { ThemeService } from '../theme.service';

/** Theme settings for the navbar. */
@Component({
  templateUrl: './theme-nav-content.component.html',
  styleUrls: ['./theme-nav-content.component.scss'],
})
export class ThemeNavContentComponent implements CustomTileComponent {
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
