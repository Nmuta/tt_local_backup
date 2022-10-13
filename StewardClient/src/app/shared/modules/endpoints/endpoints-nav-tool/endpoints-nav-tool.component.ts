import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { CustomTileComponent, HomeTileInfo } from '@environments/environment';
import { renderGuard } from '@helpers/rxjs';
import { Select, Store } from '@ngxs/store';
import { WindowService } from '@services/window';
import {
  EndpointKeyMemoryState,
  EndpointKeyMemoryModel,
} from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import {
  SetApolloEndpointKey,
  SetSunriseEndpointKey,
  SetWoodstockEndpointKey,
  SetSteelheadEndpointKey,
} from '@shared/state/user-settings/user-settings.actions';
import {
  UserSettingsState,
  UserSettingsStateModel,
} from '@shared/state/user-settings/user-settings.state';
import { cloneDeep, every, max } from 'lodash';
import { filter, Observable, takeUntil } from 'rxjs';

const ENDPOINT_OPTION_ACTIVE_ICON = 'explore';
const ENDPOINT_OPTION_IMPOSSIBLE_ICON = 'dangerous';

interface EndpointOptionSet {
  name: string;
  tooltip: string;

  icon?: string;
  iconTooltip?: string;
  isPossible?: boolean;
  isActive?: boolean;

  apolloEndpointKey: string;
  sunriseEndpointKey: string;
  woodstockEndpointKey: string;
  steelheadEndpointKey: string;
}

interface EndpointStateEntry {
  classes: Record<string, boolean>;
  isFlight: boolean;
  isRetail: boolean;
}

interface EndpointStateEntrySpacer {
  isSpacer: true;
  classes: Record<string, boolean>;
  tooltip: string;
}

interface EndpointStateLine {
  entries: (EndpointStateEntry | EndpointStateEntrySpacer)[];
  flightEntries: EndpointStateEntry[];
  retailEntries: EndpointStateEntry[];
  devEntries: EndpointStateEntry[];
}

type EndpointStateGrid = EndpointStateLine[];

const QUICK_ENDPOINT_OPTIONS: EndpointOptionSet[] = [
  {
    name: 'Select All Retail Endpoints',
    tooltip: 'Selects Flight for FM, and Retail for all other titles',
    icon: 'question_mark',

    apolloEndpointKey: 'Retail',
    sunriseEndpointKey: 'Retail',
    woodstockEndpointKey: 'Retail',
    steelheadEndpointKey: 'Flight',
  },
  {
    name: 'Select All Studio Endpoints',
    tooltip: 'Selects Studio endpoints for all titles',
    icon: 'question_mark',

    apolloEndpointKey: 'Studio',
    sunriseEndpointKey: 'Studio',
    woodstockEndpointKey: 'Studio',
    steelheadEndpointKey: 'Studio',
  },
];

/**
 * View and adjust current endpoint settings in the navbar.
 */
@Component({
  templateUrl: './endpoints-nav-tool.component.html',
  styleUrls: ['./endpoints-nav-tool.component.scss'],
})
export class EndpointsNavToolComponent
  extends BaseComponent
  implements OnInit, CustomTileComponent
{
  /** Set to true when this component should be disabled. */
  @Input() public disabled: boolean;
  /** The nav item we are working with. */
  @Input() public item: HomeTileInfo;

  @Select(UserSettingsState) public userSettings$: Observable<UserSettingsStateModel>;
  @Select(EndpointKeyMemoryState) public endpointKeys$: Observable<EndpointKeyMemoryModel>;

  public apolloEndpointKey: string;
  public sunriseEndpointKey: string;
  public woodstockEndpointKey: string;
  public steelheadEndpointKey: string;

  public apolloEndpointKeyList: string[];
  public sunriseEndpointKeyList: string[];
  public woodstockEndpointKeyList: string[];
  public steelheadEndpointKeyList: string[];

  public endpointStateGrid: EndpointStateGrid = [];

  public quickEndpointOptions = QUICK_ENDPOINT_OPTIONS;
  public allUpTooltip = '';

  constructor(private readonly store: Store, private readonly windowService: WindowService) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnInit(): void {
    this.endpointKeys$
      .pipe(
        filter(latest => {
          return (
            latest.Apollo.length > 0 &&
            latest.Sunrise.length > 0 &&
            latest.Woodstock.length > 0 &&
            latest.Steelhead.length > 0
          );
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(latest => {
        this.apolloEndpointKeyList = latest.Apollo;
        this.sunriseEndpointKeyList = latest.Sunrise;
        this.woodstockEndpointKeyList = latest.Woodstock;
        this.steelheadEndpointKeyList = latest.Steelhead;
        this.refreshState();
      });

    this.userSettings$.pipe(takeUntil(this.onDestroy$)).subscribe(latest => {
      this.apolloEndpointKey = latest.apolloEndpointKey;
      this.sunriseEndpointKey = latest.sunriseEndpointKey;
      this.woodstockEndpointKey = latest.woodstockEndpointKey;
      this.steelheadEndpointKey = latest.steelheadEndpointKey;
      this.refreshState();
    });
  }

  /** Produces a formatted tooltip for the box. */
  public makeTooltip(title: string, endpoint: string, selectedEndpoint: string) {
    if (endpoint === selectedEndpoint) {
      return `${title} ${endpoint} (active)`;
    }

    return `${title} ${endpoint}`;
  }

  /** Produces a set of classes for the entry. */
  public determineClasses(endpoint: string, selectedEndpoint: string) {
    return {
      entry: true,
      active: endpoint === selectedEndpoint,
      retail: endpoint === 'Retail',
      flight: endpoint === 'Flight',
    };
  }

  /** Sets all endpoints and reloads the page. */
  public setAllEndpoints(optionSet: EndpointOptionSet): void {
    this.store
      .dispatch([
        new SetApolloEndpointKey(optionSet.apolloEndpointKey),
        new SetSunriseEndpointKey(optionSet.sunriseEndpointKey),
        new SetWoodstockEndpointKey(optionSet.woodstockEndpointKey),
        new SetSteelheadEndpointKey(optionSet.steelheadEndpointKey),
      ])
      .subscribe(() => {
        this.windowService.location().reload();
      });
  }

  /** Sets all endpoints and reloads the page. */
  public setSteelheadEndpoint(newEndpoint: string): void {
    this.store.dispatch([new SetSteelheadEndpointKey(newEndpoint)]).subscribe(() => {
      this.windowService.location().reload();
    });
  }

  /** Sets all endpoints and reloads the page. */
  public setWoodstockEndpoint(newEndpoint: string): void {
    this.store.dispatch([new SetWoodstockEndpointKey(newEndpoint)]).subscribe(() => {
      this.windowService.location().reload();
    });
  }

  private refreshState(): void {
    renderGuard(() => {
      const optionSets = QUICK_ENDPOINT_OPTIONS;
      const withPossibilityState = this.markEndpointPossibilities(optionSets);
      const withActiveState = this.markActiveStates(withPossibilityState);
      const withUpdateIcons = this.setIcons(withActiveState);
      this.quickEndpointOptions = withUpdateIcons;
      this.endpointStateGrid = this.makeGrid();

      this.allUpTooltip = [
        `FM: ${this.steelheadEndpointKey}`,
        `FH5: ${this.woodstockEndpointKey}`,
        `FH4: ${this.sunriseEndpointKey}`,
        `FM7: ${this.apolloEndpointKey}`,
      ].join('\n');
    });
  }

  private makeGrid(): EndpointStateGrid {
    const initialGrid = [
      this.makeLineForTitle(this.steelheadEndpointKeyList, this.steelheadEndpointKey),
      this.makeLineForTitle(this.woodstockEndpointKeyList, this.woodstockEndpointKey),
      this.makeLineForTitle(this.sunriseEndpointKeyList, this.sunriseEndpointKey),
      this.makeLineForTitle(this.apolloEndpointKeyList, this.apolloEndpointKey),
    ];

    const maxRetailEntries = max(initialGrid.map(l => l.retailEntries.length));
    const maxDevEntries = max(initialGrid.map(l => l.devEntries.length));
    const maxFlightEntries = max(initialGrid.map(l => l.flightEntries.length));

    const spacerEntry: EndpointStateEntrySpacer = {
      isSpacer: true,
      classes: { entry: true, spacer: true },
      tooltip: null,
    };
    for (const line of initialGrid) {
      line.entries = [];

      // retail
      for (let i = 0; i < maxRetailEntries - line.retailEntries.length; i++) {
        line.entries.push(spacerEntry);
      }
      line.entries.push(...line.retailEntries);

      // dev
      line.entries.push(...line.devEntries);
      for (let i = 0; i < maxDevEntries - line.devEntries.length; i++) {
        line.entries.push(spacerEntry);
      }

      // flights
      line.entries.push(...line.flightEntries);
      for (let i = 0; i < maxFlightEntries - line.flightEntries.length; i++) {
        line.entries.push(spacerEntry);
      }
    }

    return initialGrid;
  }

  private makeLineForTitle(
    endpointKeyList: string[],
    selectedEndpointKey: string,
  ): EndpointStateLine {
    if (!endpointKeyList || !selectedEndpointKey) {
      return {
        entries: null,
        devEntries: [],
        flightEntries: [],
        retailEntries: [],
      };
    }

    const line: EndpointStateEntry[] = [];
    for (const endpointKey of endpointKeyList) {
      line.push({
        classes: this.determineClasses(endpointKey, selectedEndpointKey),
        isFlight: endpointKey.toLowerCase().includes('flight'),
        isRetail: endpointKey.toLowerCase().includes('retail'),
      });
    }

    const flightEntries = line.filter(e => e.isFlight);
    const retailEntries = line.filter(e => e.isRetail && !e.isFlight);
    const devEntries = line.filter(e => !e.isRetail && !e.isFlight);

    return {
      entries: null,
      devEntries,
      flightEntries,
      retailEntries,
    };
  }

  private markEndpointPossibilities(optionSets: EndpointOptionSet[]): EndpointOptionSet[] {
    optionSets = cloneDeep(optionSets);
    for (const optionSet of optionSets) {
      const possibilityChecks = [
        this.apolloEndpointKeyList.includes(optionSet.apolloEndpointKey),
        this.woodstockEndpointKeyList.includes(optionSet.woodstockEndpointKey),
        this.sunriseEndpointKeyList.includes(optionSet.sunriseEndpointKey),
        this.steelheadEndpointKeyList.includes(optionSet.steelheadEndpointKey),
      ];
      optionSet.isPossible = every(possibilityChecks, x => x);
    }

    return optionSets;
  }

  private markActiveStates(optionSets: EndpointOptionSet[]): EndpointOptionSet[] {
    optionSets = cloneDeep(optionSets);
    for (const optionSet of optionSets) {
      const possibilityChecks = [
        optionSet.apolloEndpointKey == this.apolloEndpointKey,
        optionSet.woodstockEndpointKey == this.woodstockEndpointKey,
        optionSet.sunriseEndpointKey == this.sunriseEndpointKey,
        optionSet.steelheadEndpointKey == this.steelheadEndpointKey,
      ];
      optionSet.isActive = every(possibilityChecks, x => x);
    }

    return optionSets;
  }

  private setIcons(optionSets: EndpointOptionSet[]): EndpointOptionSet[] {
    optionSets = cloneDeep(optionSets);
    for (const optionSet of optionSets) {
      if (optionSet.isActive) {
        optionSet.icon = ENDPOINT_OPTION_ACTIVE_ICON;
        optionSet.iconTooltip = 'This configuration is active';
        continue;
      }

      if (!optionSet.isPossible) {
        optionSet.icon = ENDPOINT_OPTION_IMPOSSIBLE_ICON;
        optionSet.iconTooltip = 'This combination is broken. Contact support';
        optionSet.tooltip = 'This combination is broken. Contact support';
        continue;
      }

      if (optionSet.isPossible) {
        optionSet.icon = '';
      }
    }

    return optionSets;
  }
}
