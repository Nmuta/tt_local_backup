import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ControlValueAccessor, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { BaseComponent } from '@components/base-component/base.component';
import { SimpleCar } from '@models/cars';
import { PegasusProjectionSlot } from '@models/enums';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import BigNumber from 'bignumber.js';
import { cloneDeep, find } from 'lodash';
import { Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

/** The form control output type for make model autocomplete. */
export type MakeModelAutoCompleteFormValue = SimpleCar;

export type MakeModelFilterGroup = {
  category: string;
  items: SimpleCar[];
};

/** A base component for ugcs filters. */
@Component({
  template: '',
})
export abstract class MakeModelAutocompleteBaseComponent
  extends BaseComponent
  implements OnInit, ControlValueAccessor
{
  /** Pre-selects given car id in the select dropdown.  */
  @Input() preselectedId: BigNumber;
  /** Determines if make-only options should be shown in select dropdown. */
  @Input() public makeOnlyOptions = true;
  /** Selects the pegasus slot id to read cars from. */
  @Input() public pegasusSlotId: PegasusProjectionSlot = PegasusProjectionSlot.Live;
  /** Output when new ugc search filters are selected. */
  @Output() public changes = new EventEmitter<SimpleCar>();

  public formControls = {
    makeModelInput: new UntypedFormControl(null),
  };

  /** UGC filters form group. */
  public formGroup: UntypedFormGroup = new UntypedFormGroup(this.formControls);
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

  public abstract getSimpleCars$(): Observable<SimpleCar[]>;

  /** Initialization hook. */
  public ngOnInit(): void {
    this.getMonitor = this.getMonitor.repeat();
    this.getSimpleCars$()
      .pipe(this.getMonitor.monitorSingleFire(), takeUntil(this.onDestroy$))
      .subscribe(cars => {
        this.makeModelFilterGroups = this.buildMatAutocompleteState(cars);
        this.stateGroupOptions$ = this.formControls.makeModelInput?.valueChanges.pipe(
          startWith(''),
          map(value => this.filterGroup(value)),
          takeUntil(this.onDestroy$),
        );

        const preselectedCar = find(cars, { id: this.preselectedId });
        if (!!preselectedCar) {
          this.formControls.makeModelInput.patchValue(preselectedCar, { emitEvent: false });
        }
      });

    this.formGroup.valueChanges
      .pipe(
        map(internal => this.makeValue(internal)),
        takeUntil(this.onDestroy$),
      )
      .subscribe(data => this.changeFn(data));
  }

  /** Form control hook. */
  public writeValue(data: SimpleCar): void {
    if (!!data) {
      this.formControls.makeModelInput.patchValue(data, { emitEvent: false });
    } else {
      this.clearMakeModelInput();
    }
  }

  /** Form control hook. */
  public registerOnChange(fn: (data: SimpleCar) => void): void {
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
    const carFilter = (this.formControls.makeModelInput?.value as SimpleCar) || null;
    this.changes.emit(carFilter);
  }

  /** Mat autocomplete display */
  public autoCompleteDisplayFn(item: SimpleCar): string {
    return !!item ? (!item?.makeOnly ? `${item.displayName} [${item.id}]` : item.make) : '';
  }

  /** Clears the make model input and resubmits the search filters. */
  public clearMakeModelInput(): void {
    this.formControls.makeModelInput.setValue('');
    this.emitMakeModelChangeEvent();
  }

  /** Sets up the stateGroups variable used with the autocomplete */
  private buildMatAutocompleteState(cars: SimpleCar[]): MakeModelFilterGroup[] {
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
  private filterGroup(value: string | SimpleCar): MakeModelFilterGroup[] {
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

  private filter(prefix: string, opt: SimpleCar[], value: string): SimpleCar[] {
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
  private checkFilterAgainstInventoryItem(item: SimpleCar, filter: string): boolean {
    return (
      item?.make.toLowerCase().includes(filter) ||
      item?.model.toLowerCase().includes(filter) ||
      item?.id?.toString().includes(filter)
    );
  }

  private changeFn = (_data: SimpleCar) => {
    /* Empty */
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private makeValue(internalValue: any): SimpleCar {
    if (internalValue.makeModelInput) {
      return internalValue.makeModelInput;
    }

    return null;
  }
}
