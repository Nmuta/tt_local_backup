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
import { Observable } from 'rxjs';
import { startWith } from 'rxjs/operators';

/** Shared proxies for syncing with Theme-oriented User Settings. */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  @Select(UserSettingsState) public settings$: Observable<UserSettingsStateModel>;

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
    });
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
