import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { EMPTY, Observable } from 'rxjs';
import { KustoQuery } from '@models/kusto';
import { KustoService } from '@services/kusto';
import { catchError, map, startWith, take, takeUntil } from 'rxjs/operators';
import { KustoQueries } from '@models/kusto/kusto-queries';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

export type KustoQueryGroup = {
  category: string;
  items: KustoQuery[];
};
/** The query-selection component. */
@Component({
  selector: 'kusto-query-selection',
  templateUrl: './kusto-query-selection.component.html',
  styleUrls: ['./kusto-query-selection.component.scss'],
})
export class KustoQuerySelectionComponent extends BaseComponent implements OnInit {
  /** REVIEW-COMMENT: Select query text. */
  @Input() public selectQueryText: string = 'Use Kusto Query';
  /** REVIEW-COMMENT: Output when a kusto query is selected. */
  @Output() public selectedKustoQueryEvent = new EventEmitter<KustoQuery>();

  public queryGroups: KustoQueryGroup[];
  public selectedItem: KustoQuery;
  public queryInputValue: string = '';

  public reloadIcon = faSyncAlt;

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  /** Master Inventory autocomplete varsiables */
  public querySelectionForm: FormGroup = this.formBuilder.group({
    queryInput: new FormControl('', Validators.required),
  });

  public stateGroupOptions$: Observable<KustoQueryGroup[]>;

  constructor(
    private readonly kustoService: KustoService,
    private readonly formBuilder: FormBuilder,
  ) {
    super();
  }

  /** Lifecycle hook. */
  public ngOnInit(): void {
    this.isLoading = true;
    this.loadError = undefined;

    // Request kusto queries
    this.kustoService
      .getKustoQueries$()
      .pipe(
        take(1),
        catchError(error => {
          this.isLoading = false;
          this.loadError = error;
          this.querySelectionForm.markAllAsTouched();
          return EMPTY;
        }),
        takeUntil(this.onDestroy$),
      )
      .subscribe(response => {
        this.isLoading = false;
        this.queryGroups = this.buildMatAutocompleteState(response);
        this.stateGroupOptions$ = this.querySelectionForm.get('queryInput')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterGroup(value)),
          takeUntil(this.onDestroy$),
        );
      });
  }

  /** Mat option display */
  public queryAutoCompleteDisplayFn(item: KustoQuery): string {
    return item?.name ?? '';
  }

  /** Sets up the stateGroups variable used with the autocomplete */
  public buildMatAutocompleteState(kustoQueries: KustoQueries): KustoQueryGroup[] {
    const queryGroups: KustoQueryGroup[] = [];
    for (const query of kustoQueries) {
      const queryGroupIndex = queryGroups.findIndex(group => group.category === query.title);
      if (queryGroupIndex >= 0) {
        queryGroups[queryGroupIndex].items.push(query);
      } else {
        queryGroups.push({
          category: query.title,
          items: [query],
        });
      }
    }

    return queryGroups;
  }

  /** New query selected. */
  public selectedQueryEmitter(formDirective: FormGroupDirective): void {
    if (!this.selectedItem) {
      return;
    }

    this.selectedKustoQueryEvent.emit(_.clone(this.selectedItem));

    this.selectedItem = undefined;
    this.querySelectionForm.reset();
    formDirective.resetForm();
  }

  /** New qeury is selected from the dropdown. */
  public newQuerySelected(item: KustoQuery): void {
    this.selectedItem = item;
  }

  /** Autocomplete filter function. */
  private filterGroup(value: string | KustoQuery): KustoQueryGroup[] {
    if (value) {
      if (typeof value !== 'string') {
        return this.queryGroups;
      }
      const prefilter = this.queryGroups.map((group: KustoQueryGroup) => ({
        category: group.category,
        items: this.filter(group.category, group.items, value),
      }));

      if ('?'.startsWith(value.toLowerCase())) {
        return prefilter.map(g => ({
          items: [],
          category: g.category,
        }));
      }

      return prefilter.filter(group => group.items.length > 0);
    }

    return this.queryGroups;
  }

  private filter(prefix: string, opt: KustoQuery[], value: string): KustoQuery[] {
    const filterValue = value.toLowerCase();
    const prefixFilterValue = prefix.toLowerCase();
    if (prefixFilterValue.includes(filterValue)) {
      return opt;
    }

    const filterValues = filterValue.split(':');
    return opt.filter(item => {
      // If no colon is used, do normal search
      if (filterValues.length <= 1) {
        return this.checkFilterAgainstKustoQuery(item, filterValue);
      }

      // If colon is used, search requires mutliple strings to be matched
      let found = true;
      for (let i = 0; i < filterValues.length; i++) {
        const filter = filterValues[i].trim();
        if (filter === '') continue;
        found = found ? this.checkFilterAgainstKustoQuery(item, filter) : false;
      }

      return found;
    });
  }

  /** Compares a filter string against an KustoQuery, returning true if the string was found. */
  private checkFilterAgainstKustoQuery(item: KustoQuery, filter: string): boolean {
    return item?.name?.toLowerCase().includes(filter);
  }
}
