import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import {
  SetThemeEnvironmentWarning,
  SetThemeOverride,
  ThemeEnvironmentWarningOptions,
  ThemeOverrideOptions,
} from '@shared/state/user-settings/user-settings.actions';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { MermaidAPI } from 'ngx-markdown';
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

/** Shared proxies for syncing with Theme-oriented User Settings. */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  @Select(UserSettingsState) public settings$: Observable<UserSettingsStateModel>;

  /** Tracks the currently configured system theme. */
  private _systemTheme: 'dark' | 'light' = 'light';

  /** Tracks the currently configured system theme. */
  public get systemTheme(): 'dark' | 'light' {
    return this._systemTheme;
  }

  /** Tracks the currently configured theme, taking overrides into account. */
  public get effectiveTheme(): 'dark' | 'light' {
    if (this.themeOverride == 'match') {
      return this.systemTheme;
    }

    return this.themeOverride;
  }

  /** A {@see MermaidAPI.Config} object for use with the markdown module. */
  private _mermaidOptions: MermaidAPI.Config = {};

  /** A {@see MermaidAPI.Config} object for use with the markdown module. */
  public get mermaidOptions(): MermaidAPI.Config {
    return this._mermaidOptions;
  }

  /** The theme override setting. */
  public get themeOverride(): ThemeOverrideOptions {
    return this._themeOverride ?? 'match';
  }

  /** The theme override setting. */
  public set themeOverride(value: ThemeOverrideOptions) {
    this._themeOverride = value;
    this.store.dispatch(new SetThemeOverride(value));
  }

  /** The theme override setting. */
  public get themeEnvironmentWarning(): ThemeEnvironmentWarningOptions {
    return this._themeEnvironmentWarning;
  }

  /** The theme override setting. */
  public set themeEnvironmentWarning(value: ThemeEnvironmentWarningOptions) {
    this._themeEnvironmentWarning = value;
    this.store.dispatch(new SetThemeEnvironmentWarning(value));
  }

  private _themeOverride: ThemeOverrideOptions = undefined;
  private _themeEnvironmentWarning: ThemeEnvironmentWarningOptions = undefined;

  constructor(
    private readonly store: Store,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    const settings = this.store.selectSnapshot<UserSettingsStateModel>(UserSettingsState);
    this.settings$.pipe(startWith(settings)).subscribe(settings => {
      this._themeOverride = settings?.themeOverride;
      this._themeEnvironmentWarning = settings?.themeEnvironmentWarning;
      this.syncTheme(settings?.themeOverride);
      this.updateMermaidOptions();
    });

    const isDarkMode =
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this._systemTheme = isDarkMode ? 'dark' : 'light';
    this.updateMermaidOptions();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      this._systemTheme = event.matches ? 'dark' : 'light';
      this.updateMermaidOptions();
    });
  }

  private updateMermaidOptions(): void {
    this._mermaidOptions = {
      darkMode: this.effectiveTheme === 'dark',
      theme: this.effectiveTheme === 'dark' ? MermaidAPI.Theme.Dark : MermaidAPI.Theme.Default,
    };
  }

  private syncTheme(option: ThemeOverrideOptions): void {
    switch (option) {
      case 'light':
        this.document.body.classList.add('apply-light-theme');
        this.document.body.classList.remove('apply-dark-theme');
        break;
      case 'dark':
        this.document.body.classList.add('apply-dark-theme');
        this.document.body.classList.remove('apply-light-theme');
        break;
      default:
        this.document.body.classList.remove('apply-dark-theme');
        this.document.body.classList.remove('apply-light-theme');
        break;
    }
  }
}
