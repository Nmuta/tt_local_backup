import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import {
  AuctionSort,
  AuctionFilters,
  AuctionStatus,
  DefaultAuctionFilters,
} from '@models/auction-filters';
import { DetailedCar } from '@models/detailed-car';
import { cloneDeep, keys } from 'lodash';
import { Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

export type MakeModelFilterGroup = {
  category: string;
  items: DetailedCar[];
};

/** A base component for auctions filters. */
@Component({
  template: '',
})
export abstract class AuctionsFiltersBaseComponent extends BaseComponent implements OnInit {
  @Output() public newAuctionFilterSearch = new EventEmitter<AuctionFilters>();

  public statusOptions = keys(AuctionStatus) as AuctionStatus[];

  public sortOptions = keys(AuctionSort) as AuctionSort[];

  public formControls = {
    makeModelInput: new FormControl(undefined),
    status: new FormControl(DefaultAuctionFilters.status, Validators.required),
    sort: new FormControl(DefaultAuctionFilters.sort, Validators.required),
  };

  /** Auction filters form group. */
  public formGroup: FormGroup = new FormGroup(this.formControls);
  public stateGroupOptions$: Observable<MakeModelFilterGroup[]>;
  public makeModelFilterGroups: MakeModelFilterGroup[];

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  constructor() {
    super();
  }

  public abstract getDetailedCars$(): Observable<DetailedCar[]>;

  /** Initialization hook. */
  public ngOnInit(): void {
    this.getDetailedCars$()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(cars => {
        this.makeModelFilterGroups = this.buildMatAutocompleteState(cars);
        this.stateGroupOptions$ = this.formGroup.get('makeModelInput')?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterGroup(value)),
          takeUntil(this.onDestroy$),
        );
      });
  }

  /** Mat option display */
  public itemAutoCompleteDisplayFn(item: string): string {
    return item ?? '';
  }

  /** Sets up the stateGroups variable used with the autocomplete */
  public buildMatAutocompleteState(cars: DetailedCar[]): MakeModelFilterGroup[] {
    const makeModelFilterGroups: MakeModelFilterGroup[] = [];

    // make
    const makeGroup = {
      category: 'Make',
      items: [],
    } as MakeModelFilterGroup;

    const modelGroup = {
      category: 'Model',
      items: [],
    } as MakeModelFilterGroup;

    for (let i = 0; i < cars?.length; i++) {
      const makeCar = cloneDeep(cars[i]);
      const modelCar = cloneDeep(cars[i]);

      if (!makeGroup.items.some(item => item.makeId.isEqualTo(makeCar.makeId))) {
        makeCar.id = undefined; // Using CarId = Undefined to know to use makeId in filter
        makeGroup.items.push(makeCar);
      }
      modelGroup.items.push(modelCar);
    }

    makeModelFilterGroups.push(makeGroup);
    makeModelFilterGroups.push(modelGroup);

    return makeModelFilterGroups;
  }

  /** Outputs new auction search filters. */
  public searchFilters(): void {
    const carFilter = this.formControls.makeModelInput.value as DetailedCar;
    const cardId = !!carFilter ? (!!carFilter.id ? carFilter.id : undefined) : undefined;
    const makeId = !!carFilter ? (!carFilter.id ? carFilter.makeId : undefined) : undefined;

    this.newAuctionFilterSearch.emit({
      carId: cardId,
      makeId: makeId,
      status: this.formControls.status.value,
      sort: this.formControls.sort.value,
    } as AuctionFilters);
  }

  /** Mat autocomplete display */
  public autoCompleteDisplayFn(item: DetailedCar): string {
    return !!item ? (!!item?.id ? `${item.make} ${item.model}` : item.make) : '';
  }

  /** Clears the make model input and resubmits the search filters. */
  public clearMakeModelInput(): void {
    this.formControls.makeModelInput.setValue('');
    this.searchFilters();
  }

  /** Autocomplete filter function. */
  private filterGroup(value: string | DetailedCar): MakeModelFilterGroup[] {
    if (value) {
      if (typeof value !== 'string') {
        return this.makeModelFilterGroups;
      }

      const prefilter = this.makeModelFilterGroups.map((group: MakeModelFilterGroup) => ({
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

    return this.makeModelFilterGroups;
  }

  private filter(prefix: string, opt: DetailedCar[], value: string): DetailedCar[] {
    const filterValue = value.toLowerCase();
    const prefixFilterValue = prefix.toLowerCase();
    if (prefixFilterValue.includes(filterValue)) {
      return opt;
    }

    const filterValues = filterValue.split(':');
    return opt.filter(item => {
      // If no colon is used, do normal search
      if (filterValues.length <= 1) {
        return this.checkFilterAgainstInventoryItem(item, filterValue);
      }

      // If colon is used, search requires mutliple strings to be matched
      let found = true;
      for (let i = 0; i < filterValues.length; i++) {
        const filter = filterValues[i].trim();
        if (filter === '') continue;
        found = found ? this.checkFilterAgainstInventoryItem(item, filter) : false;
      }

      return found;
    });
  }

  /** Compares a filter string against an InventoryItem, returning true if the string was found. */
  private checkFilterAgainstInventoryItem(item: DetailedCar, filter: string): boolean {
    return item?.make.toLowerCase().includes(filter) || item?.model.toLowerCase().includes(filter);
  }
}
