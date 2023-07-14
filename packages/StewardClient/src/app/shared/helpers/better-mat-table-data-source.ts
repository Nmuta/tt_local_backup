/* eslint-disable @typescript-eslint/member-ordering */
import { MatTableDataSource } from '@angular/material/table';
import { fakeBigNumber } from '@interceptors/fake-api/utility';

/** A MatTableDataSource that filters the way you'd expect. */
export class BetterMatTableDataSource<T, TFilter = string> extends MatTableDataSource<T> {
  private _betterFilter: TFilter;
  private _betterFilterPredicate: (data: T, filter: TFilter) => boolean = (_, __) => true;

  /** Retrieve the real filter. */
  public get betterFilter(): TFilter {
    return this._betterFilter;
  }
  /** Retrieve the real filter. */
  public set betterFilter(filter: TFilter) {
    this._betterFilter = filter;
    this.refilter();
  }

  /** Retrieve the real filter predicate. */
  public get betterFilterPredicate(): (data: T, filter: TFilter) => boolean {
    return this._betterFilterPredicate;
  }
  /** Retrieve the real filter predicate. */
  public set betterFilterPredicate(predicate: (data: T, filter: TFilter) => boolean) {
    this._betterFilterPredicate = predicate;
    this.refilter();
  }

  /** Provides type-safe access to this table's entries to templates.*/
  public cast(tableEntry: unknown): T {
    return tableEntry as T;
  }

  /**
   * Do not use.
   * @deprecated Do not use this filter method. Use betterFilterPredicate.
   */
  public filterPredicate: (data: T, filter: string) => boolean;
  /**
   * Do not use.
   * @deprecated Do not use this filter. It does not behave the way you'd expect. Use betterFilter.
   */
  public get filter(): string {
    return super.filter;
  }
  /**
   * Do not use.
   * @deprecated Do not use this filter. It does not behave the way you'd expect. Use betterFilter.
   */
  public set filter(filter: string) {
    super.filter = `${filter} ${fakeBigNumber()}`;
  }

  constructor(initialData?: T[]) {
    super(initialData);
    super.filterPredicate = (data: T, _filter: string) =>
      this.betterFilterPredicate(data, this.betterFilter);
  }

  /** Force the filter to re-run. */
  public refilter(): void {
    super.filter = `${fakeBigNumber()}`;
  }
}
