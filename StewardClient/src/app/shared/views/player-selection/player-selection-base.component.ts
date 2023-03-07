import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatChipInputEvent, MatChipListChange } from '@angular/material/chips';
import { BaseComponent } from '@components/base-component/base.component';
import {
  IdentityQueryAlpha,
  IdentityQueryBeta,
  IdentityQueryBetaIntersection,
  IdentityQueryByGamertag,
  IdentityQueryByXuid,
  IdentityResultAlpha,
  makeBetaQuery,
  toAlphaIdentity,
} from '@models/identity-query.model';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { chain, find, isEmpty, isEqual, sortBy, xor } from 'lodash';
import { filter, map, pairwise, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import {
  AnyIdentityQuery,
  MultiEnvironmentService,
  SingleUserResult,
  SingleUserResultSet,
} from '@services/multi-environment/multi-environment.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  addToPlayerSelectionQueryParams,
  handleOldPlayerSelectionQueryParams,
  mapPlayerSelectionQueryParam,
  PlayerSelectionQueryParam,
  routeToUpdatedPlayerSelectionQueryParams,
} from './player-selection-query-params';
import { QueryParam } from '@models/query-params';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';

export interface AugmentedCompositeIdentity {
  query: IdentityQueryBeta & IdentityQueryAlpha;
  general: IdentityResultAlpha;
  woodstock: IdentityResultAlpha;
  forte: IdentityResultAlpha;
  steelhead: IdentityResultAlpha;
  sunrise: IdentityResultAlpha;
  apollo: IdentityResultAlpha;
  opus: IdentityResultAlpha;

  result: SingleUserResult;

  extra?: {
    lookupType: keyof IdentityQueryBetaIntersection;
    theme: 'warn' | 'primary' | 'accent';
    isAcceptable: boolean;
    rejectionReason: string;
    isValid: boolean;
    isInvalid: boolean;
    hasWoodstock: boolean;
    hasForte: boolean;
    hasSteelhead: boolean;
    hasSunrise: boolean;
    hasApollo: boolean;
    hasOpus: boolean;
    label: string;
    labelTooltip: string;
  };
}

/** An inline user-picker with a single output. */
@Component({
  template: '',
})
export abstract class PlayerSelectionBaseComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  /** The lookup toggle. */
  @ViewChild(MatButtonToggleGroup) public lookupTypeGroup: MatButtonToggleGroup;

  /** Disables the lookup types provided in array. */
  @Input() public disableLookupTypes: string[] = [];
  /** When set to true, allows chips to be selected. */
  @Input() public allowSelection: boolean = false;
  /** When set to true, displays in a single line suitable for a navbar. */
  @Input() public displayInSingleLine: boolean = false;

  /**
   * When set, used to determine if a given identity is acceptable.
   * @returns The error message to display.
   */
  @Input() public rejectionFn: (identity: AugmentedCompositeIdentity) => string | null;

  /** Outputs a selected identity. */
  @Output() public selected = new EventEmitter<AugmentedCompositeIdentity>();

  /** The lookup type (XUID | GT | T10Id) */
  public lookupType: keyof IdentityQueryBetaIntersection = 'gamertag';
  /** Logic when setting the list of things to look up. */
  public set lookupList(values: string[]) {
    const sortedValues = sortBy(values, val => val);
    if (!isEmpty(sortedValues)) {
      this.handleNewValues(sortedValues);
    } else {
      this.foundIdentities = [];
      this.foundIdentities$.next(this.foundIdentities);
      this.knownIdentities.clear();
    }
  }

  /** The list of things to look up. */
  public get lookupList(): string[] {
    return this.foundIdentities.map(i => <string>i.query[this.lookupType]);
  }

  /** True when the input should be disabled */
  public abstract get disable(): boolean;

  /** The identities we've found. */
  public foundIdentities: AugmentedCompositeIdentity[] = [];
  /** The identities we're currently trying to find. */
  public knownIdentities = new Set<string>();
  /** List of identities to lookup that got cut due to max identity requirements. */
  public cutLookupList: string[] = [];

  /** Separators that trigger a lookup. */
  public readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];

  /** Emitted when the foundIdentities list changes. */
  protected foundIdentities$ = new Subject<AugmentedCompositeIdentity[]>();
  public lookupIdentitiessMonitor = new ActionMonitor('Lookup identities');

  // this has to be its own value because we don't have the actual thing until ngAfterViewInit, and lookupList is called before that
  private lookupTypeGroupChange$ = new Subject<void>();

  public abstract maxFoundIndentities: number;

  constructor(
    private readonly multi: MultiEnvironmentService,
    private readonly route: ActivatedRoute,
    protected readonly router: Router,
  ) {
    super();
    this.foundIdentities$
      .pipe(
        switchMap(i => this.sortFn(i)),
        takeUntil(this.onDestroy$),
      )
      .subscribe(i => (this.foundIdentities = i));
  }

  /** Called when a new set of results is selected. */
  public abstract onSelect(change: MatChipListChange): void;

  public abstract handleSpecialIdentity(): boolean;

  /** A processing function that may re-order, but not add or remove, identitites. */
  @Input() public sortFn: (
    identities: AugmentedCompositeIdentity[],
  ) => Observable<AugmentedCompositeIdentity[]> = identities => of(identities);

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.route.queryParams
      .pipe(
        filter(params => !handleOldPlayerSelectionQueryParams(params, this.router)),
        map(params => mapPlayerSelectionQueryParam(params) ?? {}),
        tap(params => {
          // Check which param key is being used and set it to the lookupType
          if (!!params[QueryParam.Xuid]) {
            this.lookupType = QueryParam.Xuid;
          } else if (!!params[QueryParam.Gamertag]) {
            this.lookupType = QueryParam.Gamertag;
          } else if (!!params[QueryParam.T10Id]) {
            this.lookupType = QueryParam.T10Id;
          }
        }),
        startWith({}),
        pairwise(),
        filter(([prev, cur]) => {
          const prevLookupVals = prev[this.lookupType] ?? [];
          const curLookupVals = cur[this.lookupType] ?? [];
          if (prevLookupVals.length <= 0 || curLookupVals.length <= 0) {
            return true;
          }

          const diff = xor(prevLookupVals, curLookupVals);
          return diff.length > 0;
        }),
        map(([_prev, cur]) => cur),
        takeUntil(this.onDestroy$),
      )
      .subscribe((param: PlayerSelectionQueryParam) => {
        const newList = param[this.lookupType];
        if (newList?.length > 0 ?? false) {
          // if we have entries, all is well. we were given a direct link and should show the new users
          this.lookupList = param[this.lookupType];
        } else {
          // if we were not given new entries, we need to handle the case where we are returning to a prior path
          if (this.lookupList?.length > 0 ?? false) {
            // if we already have entries, we have them "cached" via angular routing memory, and need to repopulate the query params
            this.updateRouteFromType(this.lookupType);
          }
        }
      });
  }

  /** Lifecycle hook. */
  public ngAfterViewInit(): void {
    this.lookupTypeGroup.change
      .pipe(
        map(v => v.value as keyof IdentityQueryBetaIntersection),
        tap(_ => this.lookupTypeGroupChange$.next()),
        takeUntil(this.onDestroy$),
      )
      .subscribe(currentType => {
        this.updateRouteFromType(currentType);

        // We use query for chip information. Update original query object to use new type
        this.foundIdentities.map(
          identity => (identity.query[currentType] = identity.general[currentType]),
        );
        this.foundIdentities$.next(this.foundIdentities);
      });
  }

  /** Paste event handler. */
  public paste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    if (!clipboardData) {
      return;
    }

    let pastedText = clipboardData.getData('text');
    pastedText = pastedText.replace(/\n|\r/g, ', ');

    this.cutLookupList = addToPlayerSelectionQueryParams(
      pastedText,
      this.lookupType,
      this.maxFoundIndentities,
      this.route,
      this.router,
    );
    event.preventDefault();
  }

  /** Add event handler. */
  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if (value.trim().length <= 0) {
      return;
    }

    this.cutLookupList = addToPlayerSelectionQueryParams(
      value,
      this.lookupType,
      this.maxFoundIndentities,
      this.route,
      this.router,
    );

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /** Remove event handler. */
  public remove(item: AugmentedCompositeIdentity): void {
    const index = this.foundIdentities.indexOf(item);
    this.cutLookupList = [];

    if (index >= 0) {
      this.foundIdentities.splice(index, 1);
      this.knownIdentities.delete(item.query[this.lookupType].toString());
      this.foundIdentities$.next(this.foundIdentities);

      const updatedQueryParams = this.foundIdentities
        .map(identity => identity.general[this.lookupType])
        .join(',');

      routeToUpdatedPlayerSelectionQueryParams(
        this.route.snapshot.queryParams,
        this.lookupType,
        updatedQueryParams,
        this.router,
      );
    }
  }

  /**
   * Handles new values
   * 1. handle removed values from found identities
   * 2. dedupes input
   * 3. create queries
   * 4. adds empty temp results for each query
   * 5. makes queries
   * 6. updates results with the query results, if possible
   */
  private handleNewValues(values: string[]): void {
    this.foundIdentities = this.foundIdentities.filter(
      identity => !!values.find(val => val === identity.general[this.lookupType].toString()),
    );

    this.foundIdentities$.next(this.foundIdentities);
    this.knownIdentities = new Set(
      this.foundIdentities.map(identity => identity.general[this.lookupType].toString()),
    );

    const uniqueValues = chain(values)
      .uniq()
      .filter(v => !this.knownIdentities.has(v));

    const newQueries = uniqueValues.map(v => makeBetaQuery(this.lookupType, v)).value();
    this.handleNewQueries(newQueries);
  }

  /**
   * Handles new queries
   * 1. adds empty temp results for each query
   * 2. makes queries
   * 3. updates results with the query results, if possible
   */
  private handleNewQueries(newQueries: IdentityQueryBeta[]): void {
    if (isEmpty(newQueries)) {
      this.foundIdentities$.next(this.foundIdentities);
      return;
    }

    const tempResults = newQueries.map(q => <AugmentedCompositeIdentity>{ query: q });

    for (const result of tempResults) {
      if (this.disable) {
        break;
      }

      this.knownIdentities.add(result.query[this.lookupType].toString());
      this.foundIdentities.push(result);
    }

    this.foundIdentities$.next(this.foundIdentities);

    // Handle special identity situation
    // If a special identity was requested (Xuid 1), getPlayerIdentities will not be called and a predefined AugmentedCompositeIdentity will be used instead
    if (this.handleSpecialIdentity()) {
      this.foundIdentities$.next(this.foundIdentities);
      return;
    }

    this.lookupIdentitiessMonitor = this.lookupIdentitiessMonitor.repeat();
    this.multi
      .getPlayerIdentities$(this.lookupType, newQueries as AnyIdentityQuery[])
      .pipe(
        this.lookupIdentitiessMonitor.monitorSingleFire(),
        takeUntil(this.onDestroy$),
        takeUntil(this.lookupTypeGroupChange$),
      )
      .subscribe(allResults => {
        // replace the results inline
        for (const result of allResults) {
          const key = result.query[this.lookupType];

          // find our index
          const compositeIdentity = find(this.foundIdentities, i =>
            isEqual(i.query[this.lookupType], key),
          );

          // skip results we no longer care about
          if (!compositeIdentity) {
            continue;
          }

          //populate the existing entry
          compositeIdentity.result = result;
          compositeIdentity.sunrise = result.standard.sunrise;
          compositeIdentity.apollo = result.standard.apollo;
          compositeIdentity.opus = result.standard.opus;
          compositeIdentity.steelhead = result.standard.steelhead;
          compositeIdentity.woodstock = result.standard.woodstock;
          compositeIdentity.forte = result.standard.forte;

          compositeIdentity.general = this.generateGeneralIdentity(compositeIdentity);

          const allRequestsErrored =
            compositeIdentity.sunrise?.error &&
            compositeIdentity.apollo?.error &&
            compositeIdentity.opus?.error &&
            compositeIdentity.steelhead?.error &&
            compositeIdentity.woodstock?.error &&
            compositeIdentity.forte?.error;

          compositeIdentity.extra = {
            lookupType: this.lookupType,
            theme: allRequestsErrored ? 'warn' : 'primary',
            isValid: !allRequestsErrored,
            isInvalid: !!allRequestsErrored,
            hasForte: compositeIdentity.forte ? !compositeIdentity.forte?.error : false,
            hasWoodstock: compositeIdentity.woodstock ? !compositeIdentity.woodstock?.error : false,
            hasSteelhead: compositeIdentity.steelhead ? !compositeIdentity.steelhead?.error : false,
            hasSunrise: compositeIdentity.sunrise ? !compositeIdentity.sunrise?.error : false,
            hasApollo: compositeIdentity.apollo ? !compositeIdentity.apollo?.error : false,
            hasOpus: compositeIdentity.opus ? !compositeIdentity.opus?.error : false,
            label: '',
            labelTooltip: '',
            isAcceptable: undefined,
            rejectionReason: undefined,
          };

          function hasRetailTitle(title: keyof SingleUserResultSet): boolean {
            const result = compositeIdentity.result.retail[title];
            if (!result) {
              return false;
            }
            if (result.error) {
              return false;
            }
            return true;
          }

          compositeIdentity.extra.label = [
            hasRetailTitle('forte') ? 'F' : undefined,
            hasRetailTitle('woodstock') ? 'W' : undefined,
            hasRetailTitle('steelhead') ? 'Sh' : undefined,
            hasRetailTitle('apollo') ? 'A' : undefined,
            hasRetailTitle('opus') ? 'O' : undefined,
            hasRetailTitle('sunrise') ? 'S' : undefined,
          ]
            .filter(v => !!v)
            .join('');

          compositeIdentity.extra.labelTooltip =
            'Retail Titles: ' +
            [
              hasRetailTitle('forte') ? 'Forte' : undefined,
              hasRetailTitle('woodstock') ? 'Woodstock' : undefined,
              hasRetailTitle('steelhead') ? 'Steelhead' : undefined,
              hasRetailTitle('apollo') ? 'Apollo' : undefined,
              hasRetailTitle('opus') ? 'Opus' : undefined,
              hasRetailTitle('sunrise') ? 'Sunrise' : undefined,
            ]
              .filter(v => !!v)
              .join(', ');

          const rejectionReason = this.rejectionFn ? this.rejectionFn(compositeIdentity) : null;
          compositeIdentity.extra.isAcceptable = !rejectionReason;
          compositeIdentity.extra.rejectionReason = rejectionReason;

          this.foundIdentities$.next(this.foundIdentities);
        }
      });
  }

  private generateGeneralIdentity(
    compositeIdentity: AugmentedCompositeIdentity,
  ): IdentityResultAlpha {
    // Build general identity manually until Xbox Live API lookup is available
    const singleUserResult = compositeIdentity.result;
    let generalIdentity: IdentityResultAlpha = chain(singleUserResult.standard)
      .values()
      .filter(v => !v.error)
      .map(identity => toAlphaIdentity(identity))
      .first()
      .value();

    // Is no valid identity found, generate a "best fit" object based on query and custom error
    const query = singleUserResult.query;
    if (!generalIdentity) {
      generalIdentity = {
        query: query,
        gamertag: (query as IdentityQueryByGamertag)?.gamertag,
        xuid: (query as IdentityQueryByXuid)?.xuid,
        error: {
          code: null,
          message: 'No identity found in Turn10 databases',
          target: null,
          details: [],
          innererror: null,
        },
      };
    }

    return generalIdentity;
  }

  private updateRouteFromType(currentType: string): void {
    const updatedQueryParams = this.foundIdentities
      .map(identity => identity.general) // Map to general identity
      .filter(identity => !identity.error) // Filter our bad identities
      .map(identity => identity[currentType])
      .filter(currentTypeIdentity => !!currentTypeIdentity)
      .map(currentTypeIdentity => currentTypeIdentity.toString()); // Handle XUIDs

    routeToUpdatedPlayerSelectionQueryParams(
      this.route.snapshot.queryParams,
      currentType,
      updatedQueryParams.join(','),
      this.router,
    );
  }
}
