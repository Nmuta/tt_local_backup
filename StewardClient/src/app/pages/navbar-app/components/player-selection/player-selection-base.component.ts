import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatChipInputEvent, MatChipListChange } from '@angular/material/chips';
import { BaseComponent } from '@components/base-component/base.component';
import {
  IdentityQueryAlpha,
  IdentityQueryBeta,
  IdentityQueryBetaIntersection,
  IdentityResultAlpha,
  IdentityResultBeta,
  makeBetaQuery,
} from '@models/identity-query.model';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { chain, find, isEmpty, isEqual } from 'lodash';
import { map, pairwise, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Observable, of, Subject } from 'rxjs';
import {
  AnyIdentityQuery,
  MultiEnvironmentService,
  SingleUserResult,
  SingleUserResultSet,
} from '@services/multi-environment/multi-environment.service';

export interface AugmentedCompositeIdentity {
  query: IdentityQueryBeta & IdentityQueryAlpha;
  woodstock: IdentityResultAlpha;
  steelhead: IdentityResultAlpha;
  sunrise: IdentityResultAlpha;
  gravity: IdentityResultBeta;
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
    hasSteelhead: boolean;
    hasSunrise: boolean;
    hasApollo: boolean;
    hasOpus: boolean;
    hasGravity: boolean;
    label: string;
    labelTooltip: string;
  };
}

/** An inline user-picker with a single output. */
@Component({
  template: '',
})
export abstract class PlayerSelectionBaseComponent extends BaseComponent implements AfterViewInit {
  /** The lookup toggle. */
  @ViewChild(MatButtonToggleGroup) public lookupTypeGroup: MatButtonToggleGroup;

  /** Disables the lookup types provided in array. */
  @Input() public disableLookupTypes: string[] = [];
  /** The chosen type of lookup. */
  @Input() public lookupType: keyof IdentityQueryBetaIntersection = 'gamertag';
  /** When set to true, allows chips to be selected. */
  @Input() public allowSelection: boolean = false;
  /** When set to true, displays in a single line suitable for a navbar. */
  @Input() public displayInSingleLine: boolean = false;

  /**
   * When set, used to determine if a given identity is acceptable.
   * @returns The error message to display.
   */
  @Input() public rejectionFn: (identity: AugmentedCompositeIdentity) => string | null;

  /** The chosen type of lookup (two way bindings). */
  @Output() public lookupTypeChange = new EventEmitter<keyof IdentityQueryBetaIntersection>();

  /** The list of things to look up. */
  @Input() public set lookupList(values: string[]) {
    this.knownIdentities.clear();
    this.foundIdentities = [];
    if (!isEmpty(values)) {
      this.handleNewValues(values, false);
    }
  }
  /** The list of things to look up. */
  public get lookupList(): string[] {
    return this.foundIdentities.map(i => <string>i.query[this.lookupType]);
  }

  /** Triggers a lookup on these items (two way bindings). */
  @Output() public lookupListChange = new EventEmitter<string[]>();

  /** True when the input should be disabled */
  public abstract get disable(): boolean;

  /** The identities we've found. */
  public foundIdentities: AugmentedCompositeIdentity[] = [];
  /** The identities we're currently trying to find. */
  public knownIdentities = new Set<string>();

  /** Separators that trigger a lookup. */
  public readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];

  /** Emitted when the foundIdentities list changes. */
  protected foundIdentities$ = new Subject<AugmentedCompositeIdentity[]>();

  // this has to be its own value because we don't have the actual thing until ngAfterViewInit, and lookupList is called before that
  private lookupTypeGroupChange$ = new Subject<void>();

  constructor(private readonly multi: MultiEnvironmentService) {
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

  /** A processing function that may re-order, but not add or remove, identitites. */
  @Input() public sortFn: (
    identities: AugmentedCompositeIdentity[],
  ) => Observable<AugmentedCompositeIdentity[]> = identities => of(identities);

  /** Lifecycle hook. */
  public ngAfterViewInit(): void {
    this.lookupTypeGroup.change
      .pipe(
        map(v => v.value as keyof IdentityQueryBetaIntersection),
        tap(v => this.lookupTypeChange.next(v)),
        tap(_ => this.lookupTypeGroupChange$.next()),
        startWith(this.lookupType),
        pairwise(),
        takeUntil(this.onDestroy$),
      )
      .subscribe(v => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [previousType, currentType] = v;

        // TODO: If you switch to XUID from Gamertag, the behavior is now the same as if you had tried to search for a gamertag as a xuid. string is not convertable to BigNumber, and as a result, user input is replaced with NaN.
        const values = this.foundIdentities.map(i =>
          chain(i)
            .values()
            .filter(v => !!v) // Handle T10Id not available in Alpha identities
            .map(v => v[previousType])
            .filter(v => !!v) // Verify the new type lookup is a valid object
            .uniq()
            .first()
            .value(),
        );

        this.foundIdentities = [];
        this.knownIdentities.clear();

        this.handleNewValues(values);
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

    const values = pastedText
      .split(/,|\r|\n/)
      .map(v => v.trim())
      .filter(v => v.length > 0);

    this.handleNewValues(values, true);

    event.preventDefault();
  }

  /** Add event handler. */
  public add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    const values = value
      .split(/,|\r|\n/)
      .map(v => v.trim())
      .filter(v => v.length > 0);

    this.handleNewValues(values, true);

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /** Remove event handler. */
  public remove(item: AugmentedCompositeIdentity): void {
    const index = this.foundIdentities.indexOf(item);

    if (index >= 0) {
      this.foundIdentities.splice(index, 1);
      this.knownIdentities.delete(item.query[this.lookupType].toString());
      this.lookupListChange.emit(this.lookupList);
      this.foundIdentities$.next(this.foundIdentities);
    }
  }

  /**
   * Handles new values
   * 1. dedupes input
   * 2. create queries
   * 3. adds empty temp results for each query
   * 4. makes queries
   * 5. updates results with the query results, if possible
   */
  private handleNewValues(values: string[], emit = true): void {
    const uniqueValues = chain(values)
      .uniq()
      .filter(v => !this.knownIdentities.has(v));

    const newQueries = uniqueValues.map(v => makeBetaQuery(this.lookupType, v)).value();
    this.handleNewQueries(newQueries, emit);
  }

  /**
   * Handles new queries
   * 1. adds empty temp results for each query
   * 2. makes queries
   * 3. updates results with the query results, if possible
   */
  private handleNewQueries(newQueries: IdentityQueryBeta[], emit = true): void {
    if (isEmpty(newQueries)) {
      if (emit) {
        this.lookupListChange.emit(this.lookupList);
      }

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

    if (emit) {
      this.lookupListChange.emit(this.lookupList);
    }

    this.foundIdentities$.next(this.foundIdentities);

    this.multi
      .getPlayerIdentities$(this.lookupType, newQueries as AnyIdentityQuery[])
      .pipe(takeUntil(this.onDestroy$), takeUntil(this.lookupTypeGroupChange$))
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
          compositeIdentity.gravity = result.standard.gravity;
          compositeIdentity.steelhead = result.standard.steelhead;
          compositeIdentity.woodstock = result.standard.woodstock;

          const allRequestsErrored =
            compositeIdentity.sunrise?.error &&
            compositeIdentity.apollo?.error &&
            compositeIdentity.opus?.error &&
            compositeIdentity.gravity?.error &&
            compositeIdentity.steelhead?.error &&
            compositeIdentity.woodstock?.error;

          compositeIdentity.extra = {
            lookupType: this.lookupType,
            theme: allRequestsErrored ? 'warn' : 'primary',
            isValid: !allRequestsErrored,
            isInvalid: !!allRequestsErrored,
            hasWoodstock: compositeIdentity.woodstock ? !compositeIdentity.woodstock?.error : false,
            hasSteelhead: compositeIdentity.steelhead ? !compositeIdentity.steelhead?.error : false,
            hasSunrise: compositeIdentity.sunrise ? !compositeIdentity.sunrise?.error : false,
            hasApollo: compositeIdentity.apollo ? !compositeIdentity.apollo?.error : false,
            hasOpus: compositeIdentity.opus ? !compositeIdentity.opus?.error : false,
            hasGravity: compositeIdentity.gravity ? !compositeIdentity.gravity?.error : false,
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
            hasRetailTitle('woodstock') ? 'W' : undefined,
            hasRetailTitle('steelhead') ? 'Sh' : undefined,
            hasRetailTitle('apollo') ? 'A' : undefined,
            hasRetailTitle('gravity') ? 'G' : undefined,
            hasRetailTitle('opus') ? 'O' : undefined,
            hasRetailTitle('sunrise') ? 'S' : undefined,
          ]
            .filter(v => !!v)
            .join('');

          compositeIdentity.extra.labelTooltip =
            'Retail Titles: ' +
            [
              hasRetailTitle('woodstock') ? 'Woodstock' : undefined,
              hasRetailTitle('steelhead') ? 'Steelhead' : undefined,
              hasRetailTitle('apollo') ? 'Apollo' : undefined,
              hasRetailTitle('gravity') ? 'Gravity' : undefined,
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
}
