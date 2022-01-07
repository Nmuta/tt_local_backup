import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { KustoCar } from '@models/kusto-car';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

export type MakeModelFilterGroup = {
  category: string;
  items: KustoCar[];
};

/** A base component for ugcs filters. */
@Component({
  template: '',
})
export abstract class MakeModelAutocompleteBaseComponent
  extends BaseComponent
  implements OnInit, ControlValueAccessor
{
  @Input() public makeOnlyOptions = true;
  @Output() public changes = new EventEmitter<KustoCar>();

  public formControls = {
    makeModelInput: new FormControl(null),
  };

  /** UGC filters form group. */
  public formGroup: FormGroup = new FormGroup(this.formControls);
  public stateGroupOptions$: Observable<MakeModelFilterGroup[]>;
  public makeModelFilterGroups: MakeModelFilterGroup[];

  public getMonitor = new ActionMonitor('GET Detailed Kusto Car List');

  /** Gets the input label. */
  public get label(): string {
    return this.makeOnlyOptions ? 'Search for make and model' : 'Search for model';
  }

  constructor() {
    super();
  }

  public abstract getKustoCars$(): Observable<KustoCar[]>;

  /** Initialization hook. */
  public ngOnInit(): void {
    this.getMonitor = new ActionMonitor(this.getMonitor.dispose().label);
    this.getKustoCars$()
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(cars => {
        this.makeModelFilterGroups = this.buildMatAutocompleteState(cars);
        this.stateGroupOptions$ = this.formControls.makeModelInput?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterGroup(value)),
          takeUntil(this.onDestroy$),
        );
      });

    this.formGroup.valueChanges
      .pipe(
        map(internal => this.makeValue(internal)),
        takeUntil(this.onDestroy$),
      )
      .subscribe(data => this.changeFn(data));
  }

  /** Form control hook. */
  public writeValue(data: KustoCar): void {
    if (!!data) {
      this.formControls.makeModelInput.patchValue(data, { emitEvent: false });
    } else {
      this.clearMakeModelInput();
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: KustoCar) => void): void {
    this.changeFn = fn;
    this.changeFn(this.makeValue(this.formGroup.value));
  }

  /** Form control hook. */
  public registerOnTouched(_fn: () => void): void {
    /** empty */
  }

  /** Form control hook. */
  public setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  /** Mat option display */
  public itemAutoCompleteDisplayFn(item: string): string {
    return item ?? '';
  }

  /** Outputs new ugc search filters. */
  public emitMakeModelChangeEvent(): void {
    const carFilter = (this.formControls.makeModelInput?.value as KustoCar) || null;
    this.changes.emit(carFilter);
  }

  /** Mat autocomplete display */
  public autoCompleteDisplayFn(item: KustoCar): string {
    return !!item ? (!item?.makeOnly ? `${item.make} ${item.model} [${item.id}]` : item.make) : '';
  }

  /** Clears the make model input and resubmits the search filters. */
  public clearMakeModelInput(): void {
    this.formControls.makeModelInput.setValue('');
    this.emitMakeModelChangeEvent();
  }

  /** Sets up the stateGroups variable used with the autocomplete */
  private buildMatAutocompleteState(cars: KustoCar[]): MakeModelFilterGroup[] {
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
        makeCar.makeOnly = true;
        makeGroup.items.push(makeCar);
      }
      modelGroup.items.push(modelCar);
    }

    if (this.makeOnlyOptions) {
      makeModelFilterGroups.push(makeGroup);
    }
    makeModelFilterGroups.push(modelGroup);

    return makeModelFilterGroups;
  }

  /** Autocomplete filter function. */
  private filterGroup(value: string | KustoCar): MakeModelFilterGroup[] {
    if (!value) {
      return this.makeModelFilterGroups;
    }

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

  private filter(prefix: string, opt: KustoCar[], value: string): KustoCar[] {
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

      // If colon is used, search requires mutliple strings to be matched.
      // Example: 'foo bar' will search entire string. 'foo:bar' will search strings 'foo' and 'bar'.
      let found = true;
      for (let i = 0; i < filterValues.length; i++) {
        const filter = filterValues[i].trim();
        if (filter === '') continue;
        found = found && this.checkFilterAgainstInventoryItem(item, filter);
      }

      return found;
    });
  }

  /** Compares a filter string against an InventoryItem, returning true if the string was found. */
  private checkFilterAgainstInventoryItem(item: KustoCar, filter: string): boolean {
    return (
      item?.make.toLowerCase().includes(filter) ||
      item?.model.toLowerCase().includes(filter) ||
      item?.id?.toString().includes(filter)
    );
  }

  private changeFn = (_data: KustoCar) => {
    /* Empty */
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private makeValue(internalValue: any): KustoCar {
    if (internalValue.makeModelInput) {
      return internalValue.makeModelInput;
    }

    return null;
  }
}
