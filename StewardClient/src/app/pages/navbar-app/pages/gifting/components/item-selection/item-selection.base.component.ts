import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { SunriseMasterInventory } from '@models/sunrise/sunrise-master-inventory.model';
import { GravityMasterInventory } from '@models/gravity/gravity-master-inventory.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

type MasterInventoryUnion = GravityMasterInventory | SunriseMasterInventory;
export type InventoryItem = {
  itemId: BigInt;
  description: string;
  quantity: BigInt;
};
export type InventoryItemGroup = {
  category: string;
  items: InventoryItem[];
};

/** The base gift-basket component. */
@Component({
  template: '',
})
export abstract class ItemSelectionBaseComponent extends BaseComponent implements OnChanges {
  @Input() public masterInventory: MasterInventoryUnion;

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  /** Master Inventory autocomplete varsiables */
  public stateForm: FormGroup = this.formBuilder.group({ stateGroup: '' });
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
  public newItemSelected(_item: InventoryItem): void {
    // console.log(item);
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
