import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import {
  environment,
  hasRequiredPermissions,
  HomeTileRestrictionType,
  NavbarTool,
} from '@environments/environment';
import { HomeTileInfoForNav, setExternalLinkTarget } from '@helpers/external-links';
import { GameTitle, UserRole } from '@models/enums';
import { QueryParam } from '@models/query-params';
import { UserModel } from '@models/user.model';
import { Select, Store } from '@ngxs/store';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { PermAttributesService } from '@services/perm-attributes/perm-attributes.service';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { GameTitleAbbreviationPipe } from '@shared/pipes/game-title-abbreviation.pipe';
import { SetNavbarTools } from '@shared/state/user-settings/user-settings.actions';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { UserState } from '@shared/state/user/user.state';
import { cloneDeep, intersection } from 'lodash';
import { Observable, of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

/** Types of filters to use on home page. */
export enum FilterType {
  Permission = 'permission',
  Title = 'title',
  Text = 'text',
}

/** Chip representation of filters applied to home page. */
export interface FilterChip {
  value: string;
  type: FilterType;
}

type FilteredTiles = {
  all: HomeTileInfoForNav[];
  filtered: HomeTileInfoForNav[];
  rejected: HomeTileInfoForNav[];
};

/** The home page to rule them all. */
@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [GameTitleAbbreviationPipe],
})
export class ToolsAppHomeComponent extends BaseComponent implements OnInit {
  @Select(UserState.profile) public profile$: Observable<UserModel>;
  @Select(UserSettingsState) public settings$: Observable<UserSettingsStateModel>;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  public isEnabled: Partial<Record<NavbarTool, number>> = {};
  public userRole: UserRole;
  public permInitializationActionMonitor = new ActionMonitor('Permission initialization');

  public availableTiles: FilteredTiles = {
    all: [],
    filtered: [],
    rejected: [],
  };

  public unauthorizedTiles: FilteredTiles = {
    all: [],
    filtered: [],
    rejected: [],
  };

  // Bits and bobs used for sorting below
  public readonly separatorKeysCodes = [ENTER, COMMA] as const;
  public filterControl = new FormControl('');
  public titleFilterOptions: Observable<FilterChip[]>;
  public permissionFilterOptions: Observable<FilterChip[]>;
  public preparedTitleFilters: FilterChip[] = [
    { value: GameTitle.FM7, type: FilterType.Title },
    { value: GameTitle.FH4, type: FilterType.Title },
    { value: GameTitle.FH5, type: FilterType.Title },
    { value: GameTitle.FM8, type: FilterType.Title },
  ];
  public roleToLoadPermissionFilterFor = UserRole.GeneralUser;
  public preparedPermissionFilters: FilterChip[] = [
    { value: 'Tools with available actions', type: FilterType.Permission },
  ];
  public startupFilters: FilterChip[] = [
    { value: 'Tools with available actions', type: FilterType.Permission },
  ];

  public filters: FilterChip[] = [];

  public fields = { groupBy: 'type', value: 'value' };

  constructor(
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly permAttributesService: PermAttributesService,
  ) {
    super();
    this.titleFilterOptions = of(this.preparedTitleFilters.slice());
    this.permissionFilterOptions = of(this.preparedPermissionFilters.slice());
  }

  /** Initialization hook. */
  public ngOnInit(): void {
    this.permAttributesService.initializationGuard$
      .pipe(
        this.permInitializationActionMonitor.monitorSingleFire(),
        switchMap(() => this.profile$),
        takeUntil(this.onDestroy$),
      )
      .subscribe(profile => {
        this.userRole = profile.role;
        const toolsList = environment.tools as HomeTileInfoForNav[];
        toolsList.forEach(tile => {
          const hasPermissions = hasRequiredPermissions(tile, this.permAttributesService);
          tile.hasAccess = hasPermissions;

          if (!hasPermissions) {
            tile.processedRestriction = tile.restriction.action;
          }
        });

        const unauthorizedNavbarItems = toolsList.filter(tool => {
          let shouldHide = false;
          if (this.userRole === UserRole.GeneralUser) {
            shouldHide =
              !tool.hasAccess && tool.processedRestriction === HomeTileRestrictionType.Hide;
          }

          return !tool.hasAccess && !shouldHide;
        });
        this.availableTiles.all = toolsList
          .filter(tool => tool.hasAccess)
          .map(tool => {
            return setExternalLinkTarget(tool);
          });

        //Create a list of which perms the user has for a given tile.
        const userAttributeNames = this.permAttributesService.permAttributeNames;
        this.availableTiles.all.forEach(tile => {
          tile.foundWritePermissions = intersection(userAttributeNames, tile.allPermissions);
          tile.writePermissionsTooltip = this.createWritePermissionsTooltip(
            tile.foundWritePermissions,
          );
        });

        // Start with the write permission filter filled in.
        if (this.userRole === UserRole.GeneralUser) {
          this.filters.push(...this.startupFilters);
        }

        this.unauthorizedTiles.all = unauthorizedNavbarItems;

        this.parseRoute();
        this.filterAllTiles();
      });

    this.settings$.pipe(takeUntil(this.onDestroy$)).subscribe(v => {
      this.isEnabled = v.navbarTools || {};
      this.isEnabled = cloneDeep(this.isEnabled); // have to clone it to make it editable
    });
  }

  /** Remove all filters for tiles. */
  public clearFilters(): void {
    this.filters = [];
    this.filterAllTiles();
    this.updateRoute(this.filters);
  }

  /** Add filter for tiles. */
  public addFilter(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    const alreadyAdded = this.filters.some(filter => {
      const valuesMatch = filter.value.toLowerCase() === value.toLowerCase();
      const textType = filter.type === FilterType.Text;

      return valuesMatch && textType;
    });

    //Don't add duplicate filters
    if (alreadyAdded) {
      this.filterControl.setValue(null);

      return;
    }

    if (value) {
      // Assume that if the input is typed in, it's a text search
      this.filters.push({ value: value, type: FilterType.Text });

      this.filterAllTiles();
    }

    // Clear the input value
    event.chipInput?.clear();
    this.filterControl.setValue(null);
    this.autocomplete.closePanel();

    this.updateRoute(this.filters);
  }

  /** Remove filter for tiles. */
  public removeFilter(filter: FilterChip): void {
    const index = this.filters.indexOf(filter);

    if (index >= 0) {
      this.filters.splice(index, 1);
      this.filterAllTiles();
      this.updateRoute(this.filters);
    }
  }

  /** Select filter to add. */
  public selectedFilter(event: MatAutocompleteSelectedEvent): void {
    const selectedFilter = event.option.value;
    const alreadyAdded = this.filters.some(filter => {
      const valuesMatch = filter.value.toLowerCase() === selectedFilter.value.toLowerCase();
      const typesMatch = filter.type === selectedFilter.type;

      return valuesMatch && typesMatch;
    });

    //Don't add duplicate filters
    if (alreadyAdded) {
      this.filterControl.setValue(null);

      return;
    }

    this.filters.push(selectedFilter);
    this.filterAllTiles();

    //clear the input value
    this.filterControl.setValue(null);

    this.updateRoute(this.filters);
  }

  /** Called when the clear tools button is clicked. */
  public clearTools(): void {
    this.store.dispatch(new SetNavbarTools({}));
  }

  /** Used in tile filtering logic. */
  private _filter(filter: FilterChip): FilterChip[] {
    const filterValue = filter.value.toLowerCase();

    return this.preparedTitleFilters.filter(filter =>
      filter.value.toLowerCase().includes(filterValue),
    );
  }

  /** Runs filtering logic on both available and unauthorized tile lists. */
  private filterAllTiles(): void {
    this.filterTiles(this.availableTiles);
    this.filterTiles(this.unauthorizedTiles);
  }

  /** Bucketize tiles based on filter list. */
  private filterTiles(tilesToFilter: FilteredTiles): void {
    if (this.filters.length <= 0) {
      tilesToFilter.filtered = tilesToFilter.all;
      tilesToFilter.rejected = [];
      return;
    }

    tilesToFilter.filtered = tilesToFilter.all.filter(tile => {
      // Filter by title
      const titleFilters = this.filters.filter(filter => {
        return filter.type == FilterType.Title;
      });

      const titlesFoundInTile = titleFilters.every(titleFilter =>
        tile.supportedTitles?.includes(titleFilter.value as GameTitle),
      );
      const passesTitleCheck = titleFilters.length === 0 || titlesFoundInTile;

      // Filter by text
      const textFilters = this.filters.filter(filter => {
        return filter.type == FilterType.Text;
      });

      const textFilterCheck = textFilters.map(textFilter => {
        const foundInTitle = tile.title.toLowerCase().includes(textFilter.value.toLowerCase());
        const foundInSubtitle = tile.subtitle
          .toLowerCase()
          .includes(textFilter.value.toLowerCase());
        const foundInDescription = tile.shortDescription.some(line =>
          line.toLowerCase().includes(textFilter.value.toLowerCase()),
        );

        return foundInTitle || foundInSubtitle || foundInDescription;
      });

      const passesTextCheck =
        textFilters.length === 0 || !textFilterCheck.some(check => check === false);

      // Permissions Check
      const hasPermissionFilter = this.filters.some(filter => {
        return filter.type == FilterType.Permission;
      });
      const passesPermissionCheck = !hasPermissionFilter || tile?.foundWritePermissions?.length > 0;

      return passesTitleCheck && passesTextCheck && passesPermissionCheck;
    });

    tilesToFilter.rejected = tilesToFilter.all.filter(
      item => !tilesToFilter.filtered.includes(item),
    );
  }

  /** Updates route params to match filter list. */
  private updateRoute(filters: FilterChip[]): void {
    const params = cloneDeep(this.route.snapshot.queryParams);
    // Clear existing params
    params[QueryParam.TitleFilters] = undefined;
    params[QueryParam.TextFilters] = undefined;

    if (filters.length > 0) {
      const titleFilters: string[] = [];
      const textFilters: string[] = [];

      filters.forEach(filter => {
        switch (filter.type) {
          case FilterType.Title:
            titleFilters.push(filter.value);
            break;
          case FilterType.Text:
            textFilters.push(filter.value);
            break;
          default:
            throw Error('Search filter does not have FilterType.');
        }
      });

      params[QueryParam.TitleFilters] =
        titleFilters.length > 0 ? titleFilters.join(',') : undefined;
      params[QueryParam.TextFilters] = textFilters.length > 0 ? textFilters?.join(',') : undefined;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
    });
  }

  /** Populates filters from route params. */
  private parseRoute(): void {
    const params = cloneDeep(this.route.snapshot.queryParams);

    const titleParams = params[QueryParam.TitleFilters];
    const titleParamGroup: string[] = titleParams?.split(',');
    titleParamGroup?.forEach(param => this.filters.push({ value: param, type: FilterType.Title }));

    const textParams = params[QueryParam.TextFilters];
    const textParamGroup: string[] = textParams?.split(',');
    textParamGroup?.forEach(param => this.filters.push({ value: param, type: FilterType.Text }));
  }

  /** Prepares a tooltip which lists available write permissions for a tile. */
  private createWritePermissionsTooltip(permissions: PermAttributeName[]): string {
    return `You have the following permissions for this tool:\n ${permissions
      .map(perm => perm.toString())
      .join(', ')}.`;
  }
}
