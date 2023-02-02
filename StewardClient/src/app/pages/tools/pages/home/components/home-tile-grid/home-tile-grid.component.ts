import { Component, Input, OnChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import {
  HomeTileInfo,
  HomeTileRestrictionType,
  isHomeTileInfoMultiExternal,
  NavbarTool,
} from '@environments/environment';
import { HomeTileInfoForNav } from '@helpers/external-links';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { GameTitleAbbreviationPipe } from '@shared/pipes/game-title-abbreviation.pipe';
import { SetNavbarTools } from '@shared/state/user-settings/user-settings.actions';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { UserState } from '@shared/state/user/user.state';
import { chain, cloneDeep } from 'lodash';
import { Observable, takeUntil } from 'rxjs';

/** The home page to rule them all. */
@Component({
  selector: 'home-tile-grid',
  templateUrl: './home-tile-grid.component.html',
  styleUrls: ['./home-tile-grid.component.scss'],
  providers: [GameTitleAbbreviationPipe],
})
export class ToolsAppHomeTileGridComponent extends BaseComponent implements OnChanges {
  @Select(UserState.profile) public profile$: Observable<UserModel>;
  @Select(UserSettingsState) public settings$: Observable<UserSettingsStateModel>;

  /** Tiles to display. */
  @Input() public tiles: HomeTileInfoForNav[];

  public isEnabled: Partial<Record<NavbarTool, number>> = {};
  public isLiveOpsAdmin: boolean = false;
  public userRole: UserRole;

  public parentRoute: string = '/app/tools/';

  public HomeTileRestrictionType = HomeTileRestrictionType;
  public UserRole = UserRole;

  constructor(private readonly store: Store) {
    super();
  }

  /** Produces true when the item is a multi external tool. */
  public isMultiExternal(item: HomeTileInfo): boolean {
    return isHomeTileInfoMultiExternal(item);
  }

  /** Initialization hook. */
  public ngOnChanges(changes: BetterSimpleChanges<ToolsAppHomeTileGridComponent>): void {
    if (!changes.tiles) {
      return;
    }

    this.profile$.pipe(takeUntil(this.onDestroy$)).subscribe(profile => {
      this.userRole = profile.role;
      // The state replaces profile.role with profile.liveOpsAdminSecondaryRole to trick the app.
      // We must check for liveOpsAdminSecondaryRole instead of role to know if the user is a LiveOpsAdmin.
      this.isLiveOpsAdmin = !!profile.overrides?.role && profile.overrides?.role === profile.role;
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
