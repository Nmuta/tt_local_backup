import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { environment, HomeTileInfo, NavbarTool } from '@environments/environment';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { SetNavbarTools } from '@shared/state/user-settings/user-settings.actions';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { UserState } from '@shared/state/user/user.state';
import { chain, cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/** The home page to rule them all. */
@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class ToolsAppHomeComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;
  @Select(UserSettingsState) public settings$: Observable<UserSettingsStateModel>;

  public isEnabled: Partial<Record<NavbarTool, number>> = {};
  public hasAccess: Partial<Record<NavbarTool, boolean>> = {};

  public parentRoute: string = '/app/tools/';

  public possibleNavbarItems: HomeTileInfo[] = environment.tools;

  constructor(private readonly store: Store) {
    super();
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.profile$.pipe(takeUntil(this.onDestroy$)).subscribe(profile => {
      this.hasAccess = chain(this.possibleNavbarItems)
        .map(v => [v.tool, v.accessList.includes(profile?.role)])
        .fromPairs()
        .value();

      // show the usable tools above the unusable tools
      const accessibleTools = environment.tools.filter(t => this.hasAccess[t.tool]);
      const inaccessibleTools = environment.tools.filter(t => !this.hasAccess[t.tool]);
      this.possibleNavbarItems = [...accessibleTools, ...inaccessibleTools];
    });

    this.settings$.pipe(takeUntil(this.onDestroy$)).subscribe(v => {
      this.isEnabled = v.navbarTools || {};
      this.isEnabled = cloneDeep(this.isEnabled); // have to clone it to make it editable
    });
  }

  /** Called when one of the checkboxes is clicked. */
  public onCheckboxChecked(tool: NavbarTool, enabled: boolean): void {
    if (enabled) {
      // add it to the end
      const highestValue = chain(this.isEnabled).values().concat(0).max().value();
      this.isEnabled[tool] = highestValue + 1;
    } else {
      // disable it
      delete this.isEnabled[tool];
    }

    // update
    this.store.dispatch(new SetNavbarTools(this.isEnabled));
  }

  /** Called when the clear tools button is clicked. */
  public clearTools(): void {
    this.store.dispatch(new SetNavbarTools({}));
  }
}
