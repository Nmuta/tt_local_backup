import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BaseComponent } from '@components/base-component/base.component';
import { HCI } from '@environments/environment';
import { DeviceType } from '@models/enums';
import {
  paramsToLeadboardQuery,
  isValidLeaderboardQuery,
  Leaderboard,
  toLeaderboardQuery,
  LeaderboardEnvironment,
} from '@models/leaderboards';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { BigNumberValidators } from '@shared/validators/bignumber-validators';
import BigNumber from 'bignumber.js';
import { keys, unionBy } from 'lodash';
import { Observable } from 'rxjs';
import { map, startWith, takeUntil, debounceTime, tap, pairwise, filter } from 'rxjs/operators';

/** Available filter types for leaderboards. */
enum LeaderboardFilterType {
  ScoreType = 'ScoreType',
  CarClass = 'CarClass',
}

/** Model for a leaderboard filter.  */
interface LeaderboardFilter {
  type: LeaderboardFilterType;
  id: BigNumber;
  name: string;
}

/** Model for a leaderboard filter group. Used for mat-autocomplete. */
interface LeaderboardFilterGroup {
  name: string;
  items: LeaderboardFilter[];
}

/** Service contract for search leaderboards. */
export interface SearchLeaderboardsContract {
  /** Gets list of all leaderboards. */
  getLeaderboards$(pegasusEnvironment: string): Observable<Leaderboard[]>;
}

/** Displays the search leaderboards tool. */
@Component({
  selector: 'search-leaderboards',
  templateUrl: './search-leaderboards.component.html',
  styleUrls: ['./search-leaderboards.component.scss'],
})
export class SearchLeaderboardsComponent extends BaseComponent implements OnInit {
  /** REVIEW-COMMENT: The search leaderboard service. */
  @Input() public service: SearchLeaderboardsContract;

  /** The object to build leaderboard filters multi-select. */
  public leaderboardFilterGroups: LeaderboardFilterGroup[] = keys(LeaderboardFilterType).map(
    filterType => {
      return { name: filterType, items: [] } as LeaderboardFilterGroup;
    },
  );
  /** The currently selected filters. */
  public selectedFilters: LeaderboardFilter[] = [];

  /** Possible device type filters */
  public readonly DeviceTypes = keys(DeviceType).filter(
    deviceType => deviceType !== DeviceType.All,
  );

  /** Possible environment selections */
  public readonly LeaderboardEnvironments = keys(LeaderboardEnvironment);

  public allLeaderboards: Leaderboard[] = [];
  /** Leaderboards available with the selected filters. */
  public filteredLeaderboards: Leaderboard[] = [];
  /** Leaderboards available within the autocomplete dropdown. */
  public autocompleteLeadeboards: Leaderboard[];
  /** The currently selected leaderboard from autocomplete. */
  public selectedLeaderboard: Leaderboard;
  /** Boolean if the search box is expanded or collapsed. */
  public expanded: boolean = true;

  public getLeaderboards = new ActionMonitor('GET leaderboards');

  public formControls = {
    filters: new FormControl([]),
    leaderboard: new FormControl(''),
    xuid: new FormControl('', [BigNumberValidators.isBigNumber()]),
    deviceTypes: new FormControl([]),
    leaderboardEnvironment: new FormControl('Prod', [Validators.required]),
  };

  public formGroup = new FormGroup(this.formControls);

  /** Getter for selected leaderboard */
  public get leaderboard(): Leaderboard {
    return this.formControls.leaderboard.value as Leaderboard;
  }

  /** Getter for selected leaderboard */
  public get xuid(): BigNumber {
    return this.formControls.xuid.value as BigNumber;
  }

  /** Getter for selected device types */
  public get deviceTypesString(): string {
    const deviceTypes = this.formControls.deviceTypes.value as string[];
    return deviceTypes?.length > 0 ? deviceTypes.join(', ') : null;
  }

  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    if (!this.service) {
      throw new Error('No service is defined for search leaderboard.');
    }

    this.listenToTargetEnvironmentChanges();
    this.setupLeaderboards(true);
    this.listenToLeaderboardInputChanges();
  }

  /** Mat autocomplete display string.  */
  public displayLeaderboards(leaderboard: Leaderboard): string {
    if (!leaderboard) return '';
    return `${leaderboard.name} ${leaderboard.scoreType}`;
  }

  /** Logic when multi-select emits changes. */
  public selectedFiltersChange(): void {
    const allFilters = this.formControls.filters.value as LeaderboardFilter[];
    const scoreFilters = allFilters.filter(
      filter => filter.type === LeaderboardFilterType.ScoreType,
    );
    const carClassFilters = allFilters.filter(
      filter => filter.type === LeaderboardFilterType.CarClass,
    );

    this.filteredLeaderboards = this.allLeaderboards.filter(leaderboard => {
      let inScoreFilters = true;
      if (scoreFilters.length > 0) {
        inScoreFilters = !!scoreFilters.find(filter =>
          filter.id.isEqualTo(leaderboard.scoreTypeId),
        );
      }

      let inCarClassFilters = true;
      if (carClassFilters.length > 0) {
        inCarClassFilters = !!carClassFilters.find(filter =>
          filter.id.isEqualTo(leaderboard.carClassId),
        );
      }

      return inScoreFilters && inCarClassFilters;
    });

    this.autocompleteLeadeboards = this.filterLeaderboards(this.formControls.leaderboard.value);
  }

  /** Removes an individual filter. */
  public removeFilter(filter: LeaderboardFilter): void {
    const filters: LeaderboardFilter[] = this.formControls.filters.value;
    const updatedFilters = filters.filter(
      f => !(f.type === filter.type && f.id.isEqualTo(filter.id)),
    );
    this.formControls.filters.setValue(updatedFilters);
    this.selectedFiltersChange();
  }

  /** Removes all selected filters. */
  public removeAllFilters(): void {
    this.formControls.filters.setValue([]);
    this.selectedFiltersChange();
  }

  /** Sets route params for new leaderboard query. */
  public setLeaderboardQueryParams(): void {
    const leaderboard = this.formControls.leaderboard.value as Leaderboard;
    const deviceTypes = this.formControls.deviceTypes.value as DeviceType[];
    const targetEnvironment = this.formControls.leaderboardEnvironment
      .value as LeaderboardEnvironment;

    leaderboard.deviceTypes = deviceTypes;
    leaderboard.leaderboardEnvironment = targetEnvironment;
    const leaderboardQuery = toLeaderboardQuery(leaderboard);
    const queryParams = {};

    for (const key of keys(leaderboardQuery)) {
      if (!!leaderboardQuery[key]) {
        queryParams[key] = leaderboardQuery[key];
      }
    }

    const xuid = new BigNumber(this.formControls.xuid.value);
    if (!xuid.isNaN()) {
      queryParams['xuid'] = xuid;
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
    });
  }

  private setupLeaderboards(prefillParams: boolean): void {
    this.getLeaderboards = this.getLeaderboards.repeat();
    this.service
      .getLeaderboards$(this.formControls.leaderboardEnvironment.value)
      .pipe(
        this.getLeaderboards.monitorSingleFire(),
        tap(leaderboards => {
          // Try best to prefill leaderboard and xuid form controls.
          const params = this.activatedRoute.snapshot.queryParams;
          if (prefillParams) {
            this.prefillEnvironmentWithParams(params);
            this.prefillLeaderboardWithParams(params, leaderboards);
            this.prefillOptionalFiltersWithParams(params);
          }
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(leaderboards => {
        this.allLeaderboards = leaderboards;
        this.filteredLeaderboards = leaderboards;
        this.autocompleteLeadeboards = this.filteredLeaderboards;
        this.buildFiltersMultiSelect();
      });
  }

  private listenToLeaderboardInputChanges(): void {
    this.formControls.leaderboard.valueChanges
      .pipe(
        tap(() => {
          this.selectedLeaderboard = null;
        }),
        debounceTime(HCI.TypingToAutoSearchDebounceMillis),
        startWith(''),
        map((input: Leaderboard | string) => {
          // When input is of type Leaderboard, it means one was selected
          // Update route params with leaderboard query data
          if (typeof input === 'object') {
            this.selectedLeaderboard = input;
          }

          return typeof input === 'string' ? input : input.name;
        }),
        map(filter =>
          filter.length > 0 ? this.filterLeaderboards(filter) : this.filteredLeaderboards,
        ),
        takeUntil(this.onDestroy$),
      )
      .subscribe(data => {
        this.autocompleteLeadeboards = data;
      });
  }

  private listenToTargetEnvironmentChanges(): void {
    this.formControls.leaderboardEnvironment.valueChanges
      .pipe(
        startWith(null),
        pairwise(),
        filter(([o, n]) => {
          return o !== n;
        }),
        map(([_o, n]) => n),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => {
        this.formControls.leaderboard.setValue('');
        this.formControls.filters.setValue([]);
        this.formControls.xuid.setValue('');
        this.setupLeaderboards(false);
      });
  }

  private filterLeaderboards(name: string): Leaderboard[] {
    const filterValue = name.toLowerCase();

    return this.filteredLeaderboards.filter(
      option =>
        option.name.toLowerCase().includes(filterValue) ||
        option.scoreType.toLowerCase().includes(filterValue),
    );
  }

  private prefillLeaderboardWithParams(params: Params, leaderboards: Leaderboard[]): void {
    const query = paramsToLeadboardQuery(params);
    const leaderboardParamsExists =
      params['scoreboardTypeId'] &&
      params['scoreTypeId'] &&
      params['gameScoreboardId'] &&
      params['trackId'];

    if (leaderboardParamsExists && isValidLeaderboardQuery(query)) {
      const leaderboard = leaderboards.find(
        l =>
          l.scoreTypeId.isEqualTo(query.scoreTypeId) &&
          l.scoreboardTypeId.isEqualTo(query.scoreboardTypeId) &&
          l.gameScoreboardId.isEqualTo(query.gameScoreboardId) &&
          l.trackId.isEqualTo(query.trackId),
      );

      if (!!leaderboard) {
        // If query params are valid, then leaderboard search
        // will be done automatically
        this.expanded = false;
        this.formControls.leaderboard.setValue(leaderboard);
      }
    }
  }

  private prefillOptionalFiltersWithParams(params: Params): void {
    const query = paramsToLeadboardQuery(params);
    const xuidParamExists = params['xuid'];

    if (xuidParamExists && !query.xuid.isNaN()) {
      this.formControls.xuid.setValue(query.xuid.toString());
    }

    if (query.deviceTypes?.trim().length > 0) {
      const foundDeviceTypes: DeviceType[] = query.deviceTypes
        .split(',')
        .map(deviceType => {
          return DeviceType[deviceType];
        })
        .filter(deviceType => !!deviceType);

      this.formControls.deviceTypes.setValue(foundDeviceTypes);
    }
  }

  private prefillEnvironmentWithParams(params: Params): void {
    const query = paramsToLeadboardQuery(params);
    const leaderboardEnvironmentParamExists = params['leaderboardEnvironment'];

    if (leaderboardEnvironmentParamExists && !!query.leaderboardEnvironment) {
      this.formControls.leaderboardEnvironment.setValue(query.leaderboardEnvironment.toString());
    }
  }

  private buildFiltersMultiSelect(): void {
    const scoreTypeGroup = this.leaderboardFilterGroups.find(
      group => group.name === LeaderboardFilterType.ScoreType,
    );
    const scoreTypeFilter = unionBy(
      this.filteredLeaderboards.map(board => {
        return {
          type: LeaderboardFilterType.ScoreType,
          id: board.scoreTypeId,
          name: board.scoreType,
        } as LeaderboardFilter;
      }),
      filter => {
        return filter.id.toString();
      },
    );

    const carClasseGroup = this.leaderboardFilterGroups.find(
      group => group.name === LeaderboardFilterType.CarClass,
    );
    const carClassFilter = unionBy(
      this.filteredLeaderboards
        .map(board => {
          return {
            type: LeaderboardFilterType.CarClass,
            id: board.carClassId,
            name: `${board.carClass} Car Class`,
          } as LeaderboardFilter;
        })
        .filter(f => f.id.isGreaterThanOrEqualTo(0)),
      filter => {
        return filter.id.toString();
      },
    ).reverse();

    scoreTypeGroup.items = scoreTypeFilter;
    carClasseGroup.items = carClassFilter;
  }
}
