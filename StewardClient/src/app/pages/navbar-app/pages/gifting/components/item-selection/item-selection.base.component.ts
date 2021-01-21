import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { GravityMasterInventory } from '@models/gravity/gravity-master-inventory.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { InventoryItem, InventoryItemGroup } from '../gift-basket/gift-basket.base.component';
import { map, startWith } from 'rxjs/operators';

type MasterInventoryUnion = GravityMasterInventory | SunriseMasterInventory;

/** The base gift-basket component. */
@Component({
  template: '',
})
export abstract class ItemSelectionBaseComponent extends BaseComponent implements OnChanges {
  @Input() public masterInventory: MasterInventoryUnion;
  @Output() public addItemEvent = new EventEmitter<InventoryItem>();

  public selectedItem: InventoryItem;
  public itemInputValue: string = '';

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  /** Master Inventory autocomplete varsiables */
  public itemSelectionForm: FormGroup = this.formBuilder.group({
    itemInput: new FormControl('', Validators.required),
    quantity: new FormControl(undefined, Validators.required),
  });
  public stateGroups: InventoryItemGroup[] = [];
  public stateGroupOptions: Observable<InventoryItemGroup[]>;

  constructor(protected readonly formBuilder: FormBuilder) {
    super();
  }

  /** Build mat autocomplete state groups. */
  public abstract buildMatAutocompleteState(): void;

  /** Angular lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes?.masterInventory && !!this.masterInventory) {
      this.buildMatAutocompleteState();
    }
  }

  /** New item selected. */
  public addItemEmit(): void {
    this.selectedItem.quantity = BigInt(this.itemSelectionForm.value['quantity']);
    this.addItemEvent.emit(this.selectedItem);

    this.selectedItem = undefined;
    this.itemSelectionForm.reset();


    this.stateGroupOptions = this.itemSelectionForm.get('itemInput')?.valueChanges.pipe(
      startWith(''),
      map(value => this.filterGroup(value)),
    );
  }

  /** New item is selected from the dropdown. */
  public newItemSelected(item: InventoryItem): void {
    this.selectedItem = item;
    document.getElementById('item-selection-quanity-input')?.focus();
  }

  /** Mat option display */
  public itemAutoCompleteDisplayFn(item: InventoryItem): string {
    return item && item.description ? item.description : '';
  }

  /** Autocomplete filter function. */
  protected filterGroup(value: string | InventoryItem): InventoryItemGroup[] {
    if (value) {
      if (typeof value !== 'string') {
        return this.stateGroups;
      }

      const prefilter = this.stateGroups.map((group: InventoryItemGroup) => ({
        category: group.category,
        items: this.filter(group.category, group.items, value),
      }));
      if ('category'.startsWith(value.toLowerCase())) {
        return prefilter.map(g => ({
          items: [],
          category: g.category,
        }));
      }
      return prefilter.filter(group => group.items.length > 0);
    }
    return this.stateGroups;
  }

  private filter(prefix: string, opt: InventoryItem[], value: string): InventoryItem[] {
    const filterValue = value.toLowerCase();
    const prefixFilterValue = prefix.toLowerCase();
    if (prefixFilterValue.includes(filterValue)) {
      return opt;
    }
    return opt.filter(item => item?.description?.toLowerCase().includes(filterValue));
  }
}
