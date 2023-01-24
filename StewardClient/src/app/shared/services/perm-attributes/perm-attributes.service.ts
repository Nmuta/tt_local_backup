import { Injectable } from '@angular/core';
import { BaseService } from '@components/base-component/base.service';
import { GameTitle, UserRole } from '@models/enums';
import { UserModel } from '@models/user.model';
import { Select } from '@ngxs/store';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { UserState } from '@shared/state/user/user.state';
import { find, has, includes } from 'lodash';
import { filter, Observable, ReplaySubject, takeUntil, tap } from 'rxjs';
import { PermAttribute, PermAttributeName } from './perm-attributes';

type TitlesAndEnvironments = {
  [key in string]: string[];
};

/** Convenience service for managing user's perm attributes. */
@Injectable({
  providedIn: 'root',
})
export class PermAttributesService extends BaseService {
  @Select(UserState.profile) public profile$: Observable<UserModel>;
  @Select(UserSettingsState) public userSettings$: Observable<UserSettingsStateModel>;
  // TODO: This will need to be revisted once all users are moved to V2
  // and we have determined how we want to handle admin grouping
  private userRole: UserRole;
  private attributesInitialized: boolean = false;
  private isServiceFullyInitialized: boolean = false;
  private allPermAttributes: PermAttribute[];
  private availableTitlesAndEnvironments: TitlesAndEnvironments = {
    [GameTitle.Forte]: [],
    [GameTitle.FM8]: [],
    [GameTitle.FM7]: [],
    [GameTitle.FH5]: [],
    [GameTitle.FH4]: [],
  };
  private selectedEndpoints = {
    [GameTitle.Forte]: null,
    [GameTitle.FM8]: null,
    [GameTitle.FM7]: null,
    [GameTitle.FH5]: null,
    [GameTitle.FH4]: null,
  };

  private checkInitialization$ = new ReplaySubject<void>(1);

  /** Helper function that timeouts state checks for user profile. */
  public get initializationGuard$(): Observable<void> {
    return this.checkInitialization$.pipe(
      filter(() => this.attributesInitialized && !!this.userRole),
      tap(() => (this.isServiceFullyInitialized = true)),
      takeUntil(this.onDestroy$),
    );
  }

  /** Gets all perm attributes. Utilize service.hasFeaturePermission to check if a specific perm attribute exists. */
  public get permAttributes(): PermAttribute[] {
    return this.allPermAttributes;
  }

  /**
   * Returns the current initialization state of the service.
   * Use initializationGuard$ if you want to wait for the service to be initialized.
   */
  public get isServiceInitialized(): boolean {
    return this.isServiceFullyInitialized;
  }

  public get isAdmin(): boolean {
    return this.userRole === UserRole.LiveOpsAdmin;
  }

  public get isUsingV1Auth(): boolean {
    return this.userRole !== UserRole.GeneralUser;
  }

  public get hasSteelheadAccess(): boolean {
    if (this.isUsingV1Auth) {
      return true;
    }
    return this.availableTitlesAndEnvironments[GameTitle.FM8].length > 0;
  }

  public get hasApolloAccess(): boolean {
    if (this.isUsingV1Auth) {
      return true;
    }
    return this.availableTitlesAndEnvironments[GameTitle.FM7].length > 0;
  }

  public get hasWoodstockAccess(): boolean {
    if (this.isUsingV1Auth) {
      return true;
    }
    return this.availableTitlesAndEnvironments[GameTitle.FH5].length > 0;
  }

  public get hasSunriseAccess(): boolean {
    if (this.isUsingV1Auth) {
      return true;
    }
    return this.availableTitlesAndEnvironments[GameTitle.FH4].length > 0;
  }

  public get steelheadEnvironments(): string[] {
    return this.availableTitlesAndEnvironments[GameTitle.FM8];
  }

  public get apolloEnvironments(): string[] {
    return this.availableTitlesAndEnvironments[GameTitle.FM7];
  }

  public get woodstockEnvironments(): string[] {
    return this.availableTitlesAndEnvironments[GameTitle.FH5];
  }

  public get sunriseEnvironments(): string[] {
    return this.availableTitlesAndEnvironments[GameTitle.FH4];
  }

  constructor() {
    super();

    this.userSettings$.pipe(takeUntil(this.onDestroy$)).subscribe(latest => {
      this.selectedEndpoints = {
        [GameTitle.Forte]: latest.forteEndpointKey,
        [GameTitle.FM8]: latest.steelheadEndpointKey,
        [GameTitle.FM7]: latest.apolloEndpointKey,
        [GameTitle.FH5]: latest.woodstockEndpointKey,
        [GameTitle.FH4]: latest.sunriseEndpointKey,
      };
    });

    UserState.latestValidProfile$(this.profile$)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(profile => {
        this.userRole = profile.role;
        this.checkInitialization$.next();
      });
  }

  /** Initiallizes the parm attributes service. */
  public initialize(attributes: PermAttribute[]): void {
    this.allPermAttributes = attributes;

    // Build the available titles and environments model
    for (const attribute of this.allPermAttributes) {
      const title = attribute.title;
      const env = attribute.environment;

      if (this.isValidTitle(title)) {
        const environments: string[] = this.availableTitlesAndEnvironments[title];
        if (!includes(environments, env)) {
          environments.push(env);
        }

        this.availableTitlesAndEnvironments[title] = environments;
      }
    }

    this.attributesInitialized = true;
    this.checkInitialization$.next();
  }

  /** Returns true if user has permission to feature attribute. */
  public hasFeaturePermission(
    attr: PermAttributeName,
    title?: GameTitle,
    allowV1Auth?: boolean,
  ): boolean {
    if (this.isAdmin) {
      return true;
    }

    if (this.isUsingV1Auth) {
      return allowV1Auth;
    }

    const titleToCheck = title ?? '';
    const environmentToCheck = !!title ? this.selectedEndpoints[title] : '';
    return !!find(this.allPermAttributes, {
      attribute: attr,
      title: titleToCheck,
      environment: environmentToCheck,
    });
  }

  private isValidTitle(title: string): boolean {
    return !!title && has(this.availableTitlesAndEnvironments, title);
  }
}
