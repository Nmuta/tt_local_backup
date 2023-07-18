import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { BaseComponent } from '@components/base-component/base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { InventoryItemGroup } from '../gift-basket/gift-basket.base.component';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { MasterInventoryItem, MasterInventoryUnion } from '@models/master-inventory-item';
import { BetterSimpleChanges } from '@helpers/simple-changes';
import { GameTitle } from '@models/enums';
import { PermAttributeName } from '@services/perm-attributes/perm-attributes';
import { ActionMonitor } from '@shared/modules/monitor-action/action-monitor';
import { clone } from 'lodash';

/** Service contract for the ItemSelectionComponent. */
export interface ItemSelectionComponentContract {
  /** Optional: Adds an item to player inventory. */
  addItemToInventory$(item: MasterInventoryItem): Observable<unknown>;
}

/** The item-selection component. */
@Component({
  selector: 'item-selection',
  templateUrl: './item-selection.component.html',
  styleUrls: ['./item-selection.component.scss'],
})
export class ItemSelectionComponent extends BaseComponent implements OnChanges {
  @ViewChild('quantity') quantityElement: ElementRef;
  /** Service contract for the component. */
  @Input() public service: ItemSelectionComponentContract;
  /** Master inventory to build item selection autocomplete. */
  @Input() public masterInventory: MasterInventoryUnion;
  /** Optional: Permission attribute to stop verification if permissions are missing. */
  @Input() public permissionAttribute: PermAttributeName;
  /** Optional: Permission game title to stop verification if permissions are missing. */
  @Input() public permissionTitle: GameTitle;
  /** Output when a master inventory item is selected. */
  @Output() public addItemEvent = new EventEmitter<MasterInventoryItem>();

  public addItemMonitor = new ActionMonitor('Add item');
  public inventoryItemGroups: InventoryItemGroup[];
  public selectedItem: MasterInventoryItem;
  public itemInputValue: string = '';

  /** True while waiting on a request. */
  public isLoading = false;
  /** The error received while loading. */
  public loadError: unknown;

  public questionIcon = faQuestionCircle;

  public formControls = {
    itemInput: new FormControl('', Validators.required),
    quantity: new FormControl(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(999_999_999),
      Validators.pattern('^(0|[1-9][0-9]*)$'),
    ]),
  };
  public formGroup = new FormGroup(this.formControls);
  public stateGroupOptions$: Observable<InventoryItemGroup[]>;

  constructor() {
    super();
  }

  /** Angular lifecycle hook. */
  public ngOnChanges(_changes: BetterSimpleChanges<ItemSelectionComponent>): void {
    if (!!this.masterInventory) {
      this.inventoryItemGroups = this.buildMatAutocompleteState();
      this.stateGroupOptions$ = this.formGroup.get('itemInput')?.valueChanges.pipe(
        startWith(''),
        map(value => this.filterGroup(value)),
        takeUntil(this.onDestroy$),
      );
    }
  }

  /** Sets up the stateGroups variable used with the autocomplete */
  public buildMatAutocompleteState(): InventoryItemGroup[] {
    const inventoryItemGroups: InventoryItemGroup[] = [];
    for (const prop in this.masterInventory) {
      if (this.masterInventory.hasOwnProperty(prop)) {
        const inventoryGroup = {
          category: prop,
          items: [],
        } as InventoryItemGroup;

        const masterInventoryItems = this.masterInventory[prop] as MasterInventoryItem[];
        for (let i = 0; i < masterInventoryItems.length; i++) {
          const masterInventoryItem = masterInventoryItems[i];
          masterInventoryItem.itemType = prop;
          inventoryGroup.items.push(masterInventoryItem);
        }

        inventoryItemGroups.push(inventoryGroup);
      }
    }

    return inventoryItemGroups;
  }

  /** Emits add item event. If service contract is defined, will also add the item to a player's inventory. */
  public addItemButtonClick(): void {
    if (!this.selectedItem) {
      return;
    }

    const itemToAdd = clone(this.selectedItem);
    itemToAdd.quantity = this.formControls.quantity.value;
    const obs$ = !!this.service ? this.service.addItemToInventory$(itemToAdd) : of(null);

    this.addItemMonitor = this.addItemMonitor.repeat();
    obs$.pipe(this.addItemMonitor.monitorSingleFire(), takeUntil(this.onDestroy$)).subscribe(() => {
      this.addItemEvent.emit(itemToAdd);

      this.selectedItem = undefined;
      this.formControls.itemInput.setValue('');
      this.formControls.quantity.setValue(1);
    });
  }

  /** New item is selected from the dropdown. */
  public newItemSelected(item: MasterInventoryItem): void {
    this.selectedItem = item;
    this.quantityElement?.nativeElement?.focus();
  }

  /** Mat option display */
  public itemAutoCompleteDisplayFn(item: MasterInventoryItem): string {
    return item?.description ?? '';
  }

  /** Autocomplete filter function. */
  private filterGroup(value: string | MasterInventoryItem): InventoryItemGroup[] {
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

  private filter(prefix: string, opt: MasterInventoryItem[], value: string): MasterInventoryItem[] {
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
  private checkFilterAgainstInventoryItem(item: MasterInventoryItem, filter: string): boolean {
    return (
      item?.description?.toLowerCase().includes(filter) ||
      item?.id?.toString()?.toLowerCase().includes(filter)
    );
  }
}
