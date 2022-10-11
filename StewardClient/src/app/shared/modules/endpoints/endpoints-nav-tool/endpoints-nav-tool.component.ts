import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { CustomTileComponent, HomeTileInfo } from '@environments/environment';
import { Select, Store } from '@ngxs/store';
import { WindowService } from '@services/window';
import { EndpointKeyMemoryState, EndpointKeyMemoryModel } from '@shared/state/endpoint-key-memory/endpoint-key-memory.state';
import { SetApolloEndpointKey, SetSunriseEndpointKey, SetWoodstockEndpointKey, SetSteelheadEndpointKey } from '@shared/state/user-settings/user-settings.actions';
import { UserSettingsState, UserSettingsStateModel } from '@shared/state/user-settings/user-settings.state';
import { cloneDeep, every } from 'lodash';
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

const QUICK_ENDPOINT_OPTIONS: EndpointOptionSet[] = [
  {
    name: 'Select Retail Endpoints',
    tooltip: 'Selects Retail and Flight',
    icon: 'question_mark',

    apolloEndpointKey: 'Retail',
    sunriseEndpointKey: 'Retail',
    woodstockEndpointKey: 'Retail',
    steelheadEndpointKey: 'Flight',
  },
  {
    name: 'Select Studio Endpoints',
    tooltip: 'Selects Retail and Flight',
    icon: 'question_mark',

    apolloEndpointKey: 'Studio',
    sunriseEndpointKey: 'Studio',
    woodstockEndpointKey: 'Studio',
    steelheadEndpointKey: 'Studio',
  },
  {
    name: 'Test Impossible Combination',
    tooltip: 'This combination is impossible',
    icon: 'question_mark',

    apolloEndpointKey: 'This',
    sunriseEndpointKey: 'Is',
    woodstockEndpointKey: 'Not',
    steelheadEndpointKey: 'A Pipe',
  }
];


@Component({
  templateUrl: './endpoints-nav-tool.component.html',
  styleUrls: ['./endpoints-nav-tool.component.scss'],
})
export class EndpointsNavToolComponent extends BaseComponent implements OnInit, CustomTileComponent {
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

  public quickEndpointOptions = QUICK_ENDPOINT_OPTIONS;
  
  constructor(
    private readonly store: Store,
    private readonly windowService: WindowService,
  ) {
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
      return `${title} ${endpoint} (active)`
    }
    
    return `${title} ${endpoint}`
  }

  /** Produces a set of classes for the entry. */
  public determineClasses(endpoint: string, selectedEndpoint: string) {
    const isRetail = endpoint === 'Retail' || endpoint === 'Flight';
    return {
      entry: true,
      active: endpoint === selectedEndpoint,
      retail: isRetail,
    };
  }

  /** Sets all endpoints and reloads the page. */
  public setAllEndpoints(optionSet: EndpointOptionSet): void {
    this.store.dispatch([
      new SetApolloEndpointKey(optionSet.apolloEndpointKey),
      new SetSunriseEndpointKey(optionSet.sunriseEndpointKey),
      new SetWoodstockEndpointKey(optionSet.woodstockEndpointKey),
      new SetSteelheadEndpointKey(optionSet.steelheadEndpointKey),
    ]).subscribe(() => {
      this.windowService.location().reload();
    });
  }

  private refreshState(): void {
    const optionSets = QUICK_ENDPOINT_OPTIONS;
    const withPossibilityState = this.markEndpointPossibilities(optionSets);
    const withActiveState = this.markActiveStates(withPossibilityState);
    const withUpdateIcons = this.setIcons(withActiveState);
    this.quickEndpointOptions = withUpdateIcons;
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
        optionSet.iconTooltip = 'This configuration is active'
        continue;
      }

      if (!optionSet.isPossible) {
        optionSet.icon = ENDPOINT_OPTION_IMPOSSIBLE_ICON;
        optionSet.iconTooltip = 'This configuration is not currently possible'
        continue;
      }

      if (optionSet.isPossible) {
        optionSet.icon = '';
      }
    }

    return optionSets;
  }
}
