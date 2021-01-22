import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BaseComponent } from '@components/base-component/base-component.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { InventoryItem, InventoryItemGroup } from '../gift-basket/gift-basket.base.component';
import { map, startWith, takeUntil } from 'rxjs/operators';

/** The item-selection component. */
@Component({
  selector: 'item-selection',
  templateUrl: './item-selection.component.html',
  styleUrls: ['./item-selection.component.scss'],
})
export class ItemSelectionComponent extends BaseComponent implements OnChanges {
  @Input() public inventoryItemGroups: InventoryItemGroup[];
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
    quantity: new FormControl(undefined, [
      Validators.required,
      Validators.min(1),
      Validators.pattern('^(0|[1-9][0-9]*)$'),
    ]),
  });
  public stateGroupOptions: Observable<InventoryItemGroup[]>;

  constructor(protected readonly formBuilder: FormBuilder) {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes?.inventoryItemGroups && !!this.inventoryItemGroups) {
      this.stateGroupOptions = this.itemSelectionForm.get('itemInput')?.valueChanges.pipe(
        takeUntil(this.onDestroy$),
        startWith(''),
        map(value => this.filterGroup(value)),
      );
    }
  }

  /** New item selected. */
  public addItemEmit(): void {
    this.selectedItem.quantity = BigInt(this.itemSelectionForm.value['quantity']);
    this.addItemEvent.emit({ ...this.selectedItem });

    this.selectedItem = undefined;
    this.itemSelectionForm.reset();

    document.getElementById('item-selection-input')?.focus();
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
        return this.inventoryItemGroups;
      }
      const prefilter = this.inventoryItemGroups.map((group: InventoryItemGroup) => ({
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
    return this.inventoryItemGroups;
  }

  private filter(prefix: string, opt: InventoryItem[], value: string): InventoryItem[] {
    const filterValue = value.toLowerCase();
    const prefixFilterValue = prefix.toLowerCase();
    if (prefixFilterValue.includes(filterValue)) {
      return opt;
    }
    return opt.filter(item => item?.description?.toLowerCase().includes(filterValue) || item?.itemId?.toString()?.toLowerCase().includes(filterValue));
  }
}
