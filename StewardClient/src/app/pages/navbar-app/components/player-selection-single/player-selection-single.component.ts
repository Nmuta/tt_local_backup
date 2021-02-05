import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatChipInputEvent } from '@angular/material/chips';
import { BaseComponent } from '@components/base-component/base-component.component';
import { IdentityQueryAlpha, IdentityResultAlpha, makeAlphaQuery } from '@models/identity-query.model';
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { SunriseService } from '@services/sunrise';
import { chain, findIndex, isEqual } from 'lodash';
import { map, pairwise, startWith, takeUntil } from 'rxjs/operators';
import { GravityService } from '@services/gravity';
import { ApolloService } from '@services/apollo';
import { OpusService } from '@services/opus';

type IdentityResultAlphaAugmented = IdentityResultAlpha & {
  extra?: {
    theme: 'warn' | 'primary' | 'accent';
    isValid: boolean;
    isInvalid: boolean;
  }
}

/** An inline user-picker with a single output. */
@Component({
  selector: 'player-selection-single',
  templateUrl: './player-selection-single.component.html',
  styleUrls: ['./player-selection-single.component.scss']
})
export class PlayerSelectionSingleComponent extends BaseComponent implements AfterViewInit {
  /** The lookup toggle. */
  @ViewChild(MatButtonToggleGroup) public lookupTypeGroup: MatButtonToggleGroup;
  /** The chosen type of lookup. */
  public get lookupType(): 'xuid' | 'gamertag' { return this.lookupTypeGroup?.value; }
  /** True when the input should be disabled */
  public get disable(): boolean { return this.knownIdentities.size > 0; }

  /** The identities we've found. */
  public foundIdentities: IdentityResultAlphaAugmented[] = [];
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
        map(v => v.value as 'xuid' | 'gamertag'),
        startWith(this.lookupType),
        pairwise(),
      ).subscribe(v => {
        const [previous, current] = v;

        const oldQueries = this.foundIdentities.map(i => i.query);
        this.foundIdentities = [];

        const newQueries = oldQueries.map(oldQuery => {
          return makeAlphaQuery(current, oldQuery[previous]);
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
  public remove(fruit: IdentityResultAlpha): void {
    const index = this.foundIdentities.indexOf(fruit);

    if (index >= 0) {
      this.foundIdentities.splice(index, 1);
      this.knownIdentities.delete(fruit.query[this.lookupType].toString());
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
    const uniqueValues = chain(values).uniq().filter(v => !this.knownIdentities.has(v));
    const newQueries = uniqueValues.map(v => makeAlphaQuery(this.lookupType, v)).value();

    this.handleNewQueries(newQueries);
  }

  /**
   * Handles new queries
   * 1. adds empty temp results for each query
   * 2. makes queries
   * 3. updates results with the query results, if possible
   */
  private handleNewQueries(newQueries: IdentityQueryAlpha[]): void {
    const tempResults = newQueries.map(q => <IdentityResultAlpha> { query: q });
    tempResults.forEach(v => {
      this.knownIdentities.add(v.query[this.lookupType].toString());
      this.foundIdentities.push(v);
    });

    // get the value and replace it in the source if it's still there
    this.sunrise.getPlayerIdentities(newQueries)
      .pipe(
        takeUntil(this.onDestroy$),
        takeUntil(this.lookupTypeGroup.change),
      )
      .subscribe((results: IdentityResultAlphaAugmented[]) => {
        for (const result of results) {
          const tempResultIndex = findIndex(this.foundIdentities, i => isEqual(i.query[this.lookupType], result.query[this.lookupType]));
          if (tempResultIndex === -1) {
            // not found
            continue;
          }

          // TODO: Come up with a nice way to not pollute this object.
          result.extra = {
            theme: result.error ? 'warn' : 'primary',
            isValid: !result.error,
            isInvalid: !!result.error,
          };

          this.foundIdentities.splice(tempResultIndex, 1, result);
        }
      });
  }
}
