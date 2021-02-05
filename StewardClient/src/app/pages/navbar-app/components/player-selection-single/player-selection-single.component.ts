import { AfterViewInit, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatChipInputEvent } from '@angular/material/chips';
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
import { chain, every, find, isEqual, keyBy, uniqBy } from 'lodash';
import { map, pairwise, startWith, takeUntil } from 'rxjs/operators';
import { GravityService } from '@services/gravity';
import { ApolloService } from '@services/apollo';
import { OpusService } from '@services/opus';
import { combineLatest, of } from 'rxjs';

export interface AugmentedCompositeIdentity {
  query: IdentityQueryBeta & IdentityQueryAlpha,
  sunrise: IdentityResultAlpha,
  gravity: IdentityResultBeta,
  apollo: IdentityResultAlpha,
  opus: IdentityResultAlpha,

  extra?: {
    theme: 'warn' | 'primary' | 'accent';
    isValid: boolean;
    isInvalid: boolean;
    hasSunrise: boolean;
    hasApollo: boolean;
    hasOpus: boolean;
    hasGravity: boolean;
  };
}

/** An inline user-picker with a single output. */
@Component({
  selector: 'player-selection-single',
  templateUrl: './player-selection-single.component.html',
  styleUrls: ['./player-selection-single.component.scss'],
})
export class PlayerSelectionSingleComponent extends BaseComponent implements AfterViewInit {
  @Output() public found = new EventEmitter<AugmentedCompositeIdentity>();

  /** The lookup toggle. */
  @ViewChild(MatButtonToggleGroup) public lookupTypeGroup: MatButtonToggleGroup;

  /** The chosen type of lookup. */
  public get lookupType(): keyof IdentityQueryBetaIntersection {
    return this.lookupTypeGroup?.value;
  }

  /** True when the input should be disabled */
  public get disable(): boolean {
    return false; //return this.knownIdentities.size > 0;
  }

  /** The identities we've found. */
  public foundIdentities: AugmentedCompositeIdentity[] = [];
  /** The identities we're currently trying to find. */
  public knownIdentities = new Set<string>();

  /** Separators that trigger a lookup. */
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];

  constructor(
    private readonly sunrise: SunriseService,
    private readonly gravity: GravityService,
    private readonly apollo: ApolloService,
    private readonly opus: OpusService,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngAfterViewInit(): void {
    this.lookupTypeGroup.change
      .pipe(
        takeUntil(this.onDestroy$),
        map(v => v.value as keyof IdentityQueryBetaIntersection),
        startWith(this.lookupType),
        pairwise(),
      )
      .subscribe(v => {
        const [previous, current] = v;

        const oldQueries = this.foundIdentities.map(i => i.query);
        this.foundIdentities = [];

        const newQueries = oldQueries.map(oldQuery => {
          return makeBetaQuery(current, oldQuery[previous]);
        });

        this.handleNewQueries(newQueries);
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

    this.handleValues(values);

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

    this.handleValues(values);

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
  private handleValues(values: string[]): void {
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
    const tempResults = newQueries.map(q => <AugmentedCompositeIdentity>{ query: q });
    tempResults.forEach(v => {
      this.knownIdentities.add(v.query[this.lookupType].toString());
      this.foundIdentities.push(v);
    });

    const queryIsAlphaCompatible = every(newQueries, q => isValidAlphaQuery(q));
    const queryIsBetaCompatible = every(newQueries, q => isValidBetaQuery(q));

    // get the value and replace it in the source if it's still there
    combineLatest([
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
    ])
      .pipe(takeUntil(this.onDestroy$), takeUntil(this.lookupTypeGroup.change))
      .subscribe(results => {
        // destructure
        const [sunriseIdentities, opusIdentities, apolloIdentities, gravityIdentities] = results;

        // make lookup for faster operations later
        const sunriseLookup = keyBy<IdentityResultAlpha>(sunriseIdentities, r => r.query[this.lookupType]);
        const opusLookup = keyBy<IdentityResultAlpha>(opusIdentities, r => r.query[this.lookupType]);
        const apolloLookup = keyBy<IdentityResultAlpha>(apolloIdentities, r => r.query[this.lookupType]);
        const gravityLookup = keyBy<IdentityResultBeta>(gravityIdentities, r => r.query[this.lookupType]);
        
        // get all unique queries that came back
        const allQueries = uniqBy([
          ...sunriseIdentities.map(q => q.query),
          ...opusIdentities.map(q => q.query),
          ...apolloIdentities.map(q => q.query),
          ...gravityIdentities.map(q => q.query),
        ], q => q[this.lookupType]);

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
            theme: allRequestsErrored ? 'warn' : 'primary',
            isValid: !allRequestsErrored,
            isInvalid: !!allRequestsErrored,
            hasSunrise: compositeIdentity.sunrise ? !compositeIdentity.sunrise?.error : false,
            hasApollo: compositeIdentity.apollo ? !compositeIdentity.apollo?.error : false,
            hasOpus: compositeIdentity.opus ? !compositeIdentity.opus?.error : false,
            hasGravity: compositeIdentity.gravity ? !compositeIdentity.gravity?.error : false,
          };
        }
      });
  }
}
