import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatChipInputEvent, MatChipListChange } from '@angular/material/chips';
import { BaseComponent } from '@components/base-component/base-component.component';
import {
  IdentityQueryAlpha,
  IdentityQueryBeta,
  IdentityQueryBetaIntersection,
  IdentityResultAlpha,
  IdentityResultBeta,
  isValidAlphaQuery,
  isValidBetaQuery,
  makeBetaQuery,
} from '@models/identity-query.model';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { SunriseService } from '@services/sunrise';
import { chain, every, find, isEmpty, isEqual, keyBy, uniqBy } from 'lodash';
import { map, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { GravityService } from '@services/gravity';
import { ApolloService } from '@services/apollo';
import { OpusService } from '@services/opus';
import { combineLatest, Observable, of, Subject } from 'rxjs';

export interface AugmentedCompositeIdentity {
  query: IdentityQueryBeta & IdentityQueryAlpha;
  sunrise: IdentityResultAlpha;
  gravity: IdentityResultBeta;
  apollo: IdentityResultAlpha;
  opus: IdentityResultAlpha;

  extra?: {
    lookupType: keyof IdentityQueryBetaIntersection;
    theme: 'warn' | 'primary' | 'accent';
    isValid: boolean;
    isInvalid: boolean;
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

  /** The chosen type of lookup. */
  @Input() public lookupType: keyof IdentityQueryBetaIntersection = 'gamertag';

  /** When set to true, allows chips to be selected. */
  @Input() public allowSelection: boolean = false;
  /** When set to true, displays in a single line suitable for a navbar. */
  @Input() public displayInSingleLine: boolean = false;

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

  // this has to be its own value because we don't have the actual thing until ngAfterViewInit, and lookupList is called before that
  private lookupTypeGroupChange = new Subject<void>();

  constructor(
    private readonly sunrise: SunriseService,
    private readonly gravity: GravityService,
    private readonly apollo: ApolloService,
    private readonly opus: OpusService,
  ) {
    super();
  }

  /** Called when a new set of results is found and populated into @see foundIdentities */
  public abstract onFound(): void;

  /** Called when a new set of results is selected. */
  public abstract onSelect(change: MatChipListChange): void;

  /** Lifecycle hook. */
  public ngAfterViewInit(): void {
    this.lookupTypeGroup.change
      .pipe(
        takeUntil(this.onDestroy$),
        map(v => v.value as keyof IdentityQueryBetaIntersection),
        tap(v => this.lookupTypeChange.next(v)),
        tap(_ => this.lookupTypeGroupChange.next()),
        startWith(this.lookupType),
        pairwise(),
      )
      .subscribe(v => {
        debugger;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [previousType, currentType] = v;

        const values = this.foundIdentities.map(i => i.query[currentType]);
        this.foundIdentities = [];

        this.handleNewValues(values, false);
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
      this.lookupListChange.emit();
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
      return;
    }

    const tempResults = newQueries.map(q => <AugmentedCompositeIdentity>{ query: q });
    tempResults.forEach(v => {
      this.knownIdentities.add(v.query[this.lookupType].toString());
      this.foundIdentities.push(v);
    });

    if (emit) {
      this.lookupListChange.emit(this.lookupList);
    }

    const queryIsAlphaCompatible = every(newQueries, q => isValidAlphaQuery(q));
    const queryIsBetaCompatible = every(newQueries, q => isValidBetaQuery(q));

    const queries: [
      a: Observable<IdentityResultAlpha[]>,
      b: Observable<IdentityResultAlpha[]>,
      c: Observable<IdentityResultAlpha[]>,
      d: Observable<IdentityResultBeta[]>,
    ] = [
      queryIsAlphaCompatible
        ? this.sunrise.getPlayerIdentities(newQueries as IdentityQueryAlpha[])
        : of(undefined as IdentityResultAlpha[]),
      queryIsAlphaCompatible
        ? this.opus.getPlayerIdentities(newQueries as IdentityQueryAlpha[])
        : of(undefined as IdentityResultAlpha[]),
      queryIsAlphaCompatible
        ? this.apollo.getPlayerIdentities(newQueries as IdentityQueryAlpha[])
        : of(undefined as IdentityResultAlpha[]),
      queryIsBetaCompatible
        ? this.gravity.getPlayerIdentities(newQueries as IdentityQueryBeta[])
        : of(undefined as IdentityResultBeta[]),
    ];

    // get the value and replace it in the source if it's still there
    combineLatest(queries)
      .pipe(takeUntil(this.onDestroy$), takeUntil(this.lookupTypeGroupChange))
      .subscribe(results => {
        // destructure
        const [sunriseIdentities, opusIdentities, apolloIdentities, gravityIdentities] = results;

        // make lookup for faster operations later
        const sunriseLookup = keyBy<IdentityResultAlpha>(
          sunriseIdentities,
          r => r.query[this.lookupType],
        );
        const opusLookup = keyBy<IdentityResultAlpha>(
          opusIdentities,
          r => r.query[this.lookupType],
        );
        const apolloLookup = keyBy<IdentityResultAlpha>(
          apolloIdentities,
          r => r.query[this.lookupType],
        );
        const gravityLookup = keyBy<IdentityResultBeta>(
          gravityIdentities,
          r => r.query[this.lookupType],
        );

        // get all unique queries that came back
        const allQueries = uniqBy(
          [
            ...sunriseIdentities.map(q => q.query),
            ...opusIdentities.map(q => q.query),
            ...apolloIdentities.map(q => q.query),
            ...gravityIdentities.map(q => q.query),
          ],
          q => q[this.lookupType],
        );

        // replace the results inline
        for (const query of allQueries) {
          const key = query[this.lookupType];

          // find our index
          const compositeIdentity = find(this.foundIdentities, i =>
            isEqual(i.query[this.lookupType], key),
          );

          if (!compositeIdentity) {
            continue;
          }

          //populate the existing entry
          compositeIdentity.sunrise = sunriseLookup[key];
          compositeIdentity.apollo = apolloLookup[key];
          compositeIdentity.opus = opusLookup[key];
          compositeIdentity.gravity = gravityLookup[key];

          const allRequestsErrored =
            compositeIdentity.sunrise?.error &&
            compositeIdentity.apollo?.error &&
            compositeIdentity.opus?.error &&
            compositeIdentity.gravity?.error;

          compositeIdentity.extra = {
            lookupType: this.lookupType,
            theme: allRequestsErrored ? 'warn' : 'primary',
            isValid: !allRequestsErrored,
            isInvalid: !!allRequestsErrored,
            hasSunrise: compositeIdentity.sunrise ? !compositeIdentity.sunrise?.error : false,
            hasApollo: compositeIdentity.apollo ? !compositeIdentity.apollo?.error : false,
            hasOpus: compositeIdentity.opus ? !compositeIdentity.opus?.error : false,
            hasGravity: compositeIdentity.gravity ? !compositeIdentity.gravity?.error : false,
            label: '',
            labelTooltip: '',
          };

          compositeIdentity.extra.label = [
            compositeIdentity.extra.hasApollo ? 'A' : undefined,
            compositeIdentity.extra.hasGravity ? 'G' : undefined,
            compositeIdentity.extra.hasOpus ? 'O' : undefined,
            compositeIdentity.extra.hasSunrise ? 'S' : undefined,
          ]
            .filter(v => !!v)
            .join('');

          compositeIdentity.extra.labelTooltip = [
            compositeIdentity.extra.hasApollo ? 'Apollo' : undefined,
            compositeIdentity.extra.hasGravity ? 'Gravity' : undefined,
            compositeIdentity.extra.hasOpus ? 'Opus' : undefined,
            compositeIdentity.extra.hasSunrise ? 'Sunrise' : undefined,
          ]
            .filter(v => !!v)
            .join(', ');

          this.onFound();
        }
      });
  }
}
